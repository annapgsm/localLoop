import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore"; 
// collection() = choose a collection
// query() = build a query (filters/sort)
// orderBy() = sort results
// onSnapshot() = real-time listener
// addDoc() = write a new document

//db= firstore database object
const Chat = ({ route, navigation, db }) => {

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

    // gets called right after comp. mounts
    useEffect(() => {

        // to update the screen header title
        navigation.setOptions({ title: name })
        
        //build a firstore query
        const q = query(
            collection(db,"messages"), 
            orderBy("createdAt","desc")
        );

        //Real Time Listener 
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

    // Called when the user sends a new message
    const onSend = (newMessages) => {
        addDoc(
            collection(db,"messages"),
            newMessages[0]
        );
    }

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