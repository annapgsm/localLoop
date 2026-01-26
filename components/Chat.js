import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {

    // React state to store all chat messages
    const [ messages, setMessages ]= useState([]);
    // Destructure parameters passed via navigation
    const { name, backgroundColor } = route.params;

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
        //preload chat with initial messages
        setMessages([
            {
                _id:1,
                text: "Hello developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any",
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true, // system messages are styled differently
            },
        ]);
    }, []);    

    // Called when the user sends a new message
    const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
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
    
    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                    name
                }}
            />

            {/* Prevents the keyboard from covering the input field on iOS */}
            {Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null}
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
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