import { View, Text, StyleSheet} from 'react-native';

const Chat = ({ route }) => {
    const { name, backgroundColor } = route.params;

    const textColorByBackground = {
        '#090C08': '#FFFFFF',
        '#474056': '#FFFFFF',
        '#8A95A5': '#000000',
        '#B9C6AE': '#000000',
    };

    const textColor = textColorByBackground[backgroundColor] || '#000000';

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.text, { color: textColor }]}>
                Hello {name}!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    text: {
        fontSize: 18,
    },
});

export default Chat;