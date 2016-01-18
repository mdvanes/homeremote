import React from 'react-native';

let {
    Platform,
    TouchableHighlight,
    TouchableNativeFeedback,
    View,
    Text,
    TextInput
} = React;

class Log extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
            TouchableElement = TouchableNativeFeedback;
        }
        return (
            <View>
                <TouchableElement>
                    <View>
                        <Text>clear (button)</Text>
                    </View>
                </TouchableElement>
                <TouchableElement>
                    <View>
                        <Text>get info (button)</Text>
                    </View>
                </TouchableElement>
                <TextInput></TextInput>
            </View>
        );
    }
}
export default Log;