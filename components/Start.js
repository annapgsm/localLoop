import { useState } from 'react';
import { StyleSheet, View, TextInput, Alert, Button, TouchableOpacity, ImageBackground } from 'react-native';

const Start = ( {navigation} ) => {
    const [text, setText] = useState('');
    const [ backgroundColor, setBackgroundColor ] = useState('#090C08');
    
    return (
        //Covers full screen
        <ImageBackground 
            source={require('../assets/background.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Chat App</Text>
                
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
                        style={[styles.colorCircle, { backgroundColor: '#090C08' }]}
                        onPress={() => setBackgroundColor('#090C08')}
                    />

                    <TouchableOpacity
                        style={[styles.colorCircle, { backgroundColor: '#474056' }]}
                        onPress={() => setBackgroundColor('#474056')}
                    />

                    <TouchableOpacity
                        style={[styles.colorCircle, { backgroundColor: '#8A95A5' }]}
                        onPress={() => setBackgroundColor('#8A95A5')}
                    />

                    <TouchableOpacity
                        style={[styles.colorCircle, { backgroundColor: '#B9C6AE' }]}
                        onPress={() => setBackgroundColor('#B9C6AE')}
                    />
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
    textInput: {
        width: '88%',
        borderWidth: 1,
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16, 
        fontWeight: '300', 
        color: '#757083', 
        backgroundColor: '#FFFFFF',
        marginTop: 20,
        marginBottom: 30,
    },

    colorLabel: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        marginBottom: 15,
    },

    startButton: {
        width: '88%',
        height: 50,
        backgroundColor: '#757083',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 40,
    },

    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },


    colorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '88%',
        marginBottom: 30,
    },

    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});

export default Start;
