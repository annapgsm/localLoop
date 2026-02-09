import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat, Bubble, SystemMessage, InputToolbar  } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
// AsyncStorage = localStorage for React Native, but async (returns Promises)
// collection() = choose a collection
// query() = build a query (filters/sort)
// orderBy() = sort results
// onSnapshot() = real-time listener
// addDoc() = write a new document



// This variable is outside the component so it doesn't reset on every re-render
let unsubMessages = null;

const Chat = ({ route, navigation, db, isConnected }) => {

    // React state to store all chat messages
    const [ messages, setMessages ]= useState([]);
    // Destructure parameters passed via navigation
    const { userID, name, backgroundColor } = route.params; // userID comes from anonymous auth

    // Map background colors to readable text colors
    const textColorByBackground = {
        '#090C08': '#FFFFFF',
        '#474056': '#FFFFFF',
        '#8A95A5': '#000000',
        '#B9C6AE': '#000000',
    };

    // Pick the correct text color based on the selected background
    const textColor = textColorByBackground[backgroundColor] || '#000000';

    /*  code version 5.3
    // gets called right after comp. mounts
    useEffect(() => {
        // to update the screen header title
        navigation.setOptions({ title: name })
        //build a firstore query
        const q = query(
            collection(db,"messages"), 
            orderBy("createdAt","desc")
        );
        //Real Time Listener- where data first gets fetched
        const unsubscribe = onSnapshot(q,(snapshot) => { //snapshot is a firestore object (current state of the query results right now)
            // Convert Firestore documents into GiftedChat message objects to match 
            const newMessages = snapshot.docs.map((doc) => {
                // return fields stored in fireStore
                const data = doc.data()
                return {
                    _id: doc.id,
                    ...data, 
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                };
            });
            setMessages(newMessages);
        });
        return () => {
            unsubscribe();
        }
    }, []);    

*/
    // Saves messages to the phone (AsyncStorage) for offline reading
    // AsyncStorage only stores strings: JSON.stringify the array of objects
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem("messages",JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    };

    // Loads messages from AsyncStorage when offline
    const loadCachedMessages= async () => {
        try {
            const cached = await AsyncStorage.getItem("messages");  // getItem returns a string or null.
            setMessages(cached ? JSON.parse(cached) : []);          // if null, use [] -> JSON.parse turns string back to array of message objects
        } catch (error) {
            console.log(error.message);
            setMessages([]);
        }
    };

    // useEffect runs once when component mounts & again whenever isConnected changes (because [isConnected] dependency)
 
    // If online: listen to Firestore + cache messages locally
    // If offline: load messages from AsyncStorage
    useEffect(()=>{
        navigation.setOptions({title:name});

        // ONLINE BRANCH:
        // Only subscribe to Firestore if there is a connection
        if(isConnected === true) {
            // If there is already an active listener from a previous run, unsubscribe it first to avoid multiple listeners piling up         
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            // Build firestore query
            const q = query(
                collection(db,"messages"),
                orderBy("createdAt","desc"),
            );
            
            //Start real time subscription 
            unsubMessages = onSnapshot (q, async (snapshot) => {
                //Build messages array for GiftedChat
                let newMessages = [];
                // snapshot.forEach loops over every document returned by the query
                snapshot.forEach(doc => {
                    const data = doc.data();    // data is an object: { text, createdAt, user, ... }

                    // GiftedChat expects: _id (unique), text, createdAt (Date), user {...}
                    newMessages.push({
                        _id: doc.id,
                        ...data,                // spread the message fields stored in Firestore
                        createdAt: data.createdAt?.toDate 
                            ? data.createdAt.toDate()       // convert Firestore Timestamp -> JS Date
                            : new Date(),                   // fallback if createdAt missing
                    });
                });
                // Save a copy to AsyncStorage so user can read offline later
                await cacheMessages(newMessages);
                // Update React state -> GiftedChat re-renders with these messages
                setMessages(newMessages);
            });
        // OFFLINE BRANCH: load locally cached messages instead
        } else {
            loadCachedMessages();
        }

        //Clean up code
        return ()=> {
            if(unsubMessages) unsubMessages();
        }
    },[isConnected]);


    // Called when the user sends a new message
    const onSend = async (newMessages = []) => {
        try {
            await addDoc(
            collection(db,"messages"),
            newMessages[0]  // Take the first message out of an array of new messages provided by GiftedChat
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    // If offline, return null so user can't type/send messages.
    const renderInputToolbar = (props) => {
        if (isConnected === true) return <InputToolbar {...props} />;
        return null;
    };

    // Custom renderer for chat bubbles
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    };

    const renderSystemMessage = (props) => (
        <SystemMessage
            {...props}
            textStyle={{
            color: textColor,
            }}
        />
    );

    
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                <GiftedChat
                    messages={messages}
                    renderBubble={renderBubble}
                    renderSystemMessage={renderSystemMessage}
                    onSend={(messages) => onSend(messages)}
                    user={{
                        _id: userID,
                        name : name,
                    }}
                    renderInputToolbar={renderInputToolbar}
                />
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    text: {
        fontSize: 18,
    },
});

export default Chat;