import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button, TouchableOpacity, ImageBackground, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';

const Start = ( {navigation} ) => {
    const [text, setText] = useState('');
    const [ backgroundColor, setBackgroundColor ] = useState('#090C08');
    
    return (
        //Covers full screen
        <ImageBackground 
            source={require('../assets/background.png')}
            style={styles.background}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={90}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>

                        <Text style={styles.title}>Chat App</Text>
                        
                        <View style={styles.card}>
                            <TextInput
                            style={styles.textInput}
                            value={text}
                            onChangeText={setText}
                            placeholder='Your Name'
                            placeholderTextColor="rgba(117, 112, 131, 0.5)"
                            />

                            <Text style={styles.colorLabel}>Choose background color:</Text>

                            <View style={styles.colorContainer}>
                                <TouchableOpacity
                                    onPress={() => setBackgroundColor('#090C08')}
                                    style={[
                                        styles.ring,
                                        backgroundColor === '#090C08' && styles.ringSelected
                                    ]}
                                >
                                    <View style={[styles.fill, { backgroundColor: '#090C08' }]} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setBackgroundColor('#474056')}
                                    style={[
                                        styles.ring,
                                        backgroundColor === '#474056' && styles.ringSelected
                                    ]}
                                    >
                                    <View style={[styles.fill, { backgroundColor: '#474056' }]} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setBackgroundColor('#8A95A5')}
                                    style={[
                                        styles.ring,
                                        backgroundColor === '#8A95A5' && styles.ringSelected
                                    ]}
                                    >
                                    <View style={[styles.fill, { backgroundColor: '#8A95A5' }]} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setBackgroundColor('#B9C6AE')}
                                    style={[
                                        styles.ring,
                                        backgroundColor === '#B9C6AE' && styles.ringSelected
                                    ]}
                                    >
                                    <View style={[styles.fill, { backgroundColor: '#B9C6AE' }]} />
                                </TouchableOpacity>
                            </View>

                            {/* 
                            <Button
                                title="Start Chatting"
                                onPress={() => navigation.navigate('Chat', {
                                    name: text,
                                    backgroundColor: backgroundColor,
                                })}
                            /> 
                            */}

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={() => navigation.navigate('Chat',{
                                    name:text,
                                    backgroundColor: backgroundColor,
                                })}
                            >
                                <Text style= {styles.startButtonText}>Start Chatting</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },

    container: {
        flex: 1,  /* spans full height of screen \*/
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50,
    },

    title: {
        fontSize: 45, 
        fontWeight: '600', 
        color: '#FFFFFF',
        marginTop: 60,
    },

    card: {
        width: '88%',
        height: '44%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },

    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(117, 112, 131, 0.5)',
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        backgroundColor: '#FFFFFF',
    },

    colorLabel: {
        width: '100%',
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
    },
    
    colorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    
    ring: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },

    ringSelected: {
        borderWidth: 2,
        borderColor: '#757083',
    },

    fill: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },


    startButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#757083',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
    },

    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Start;
