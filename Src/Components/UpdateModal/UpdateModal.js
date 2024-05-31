import { StyleSheet, View, Modal, Text, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import Colors from '../../Constants/Colors/Colors';
import VersionCheck from 'react-native-version-check';
const UpdateModal = ({ isVisible }) => {
    if (!isVisible) {
        return null;
    }
    return (
        <Modal
            visible={isVisible}
            transparent={true}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Update Required</Text>
                    <Text style={styles.message}>
                        A new version of the app is available. Please update to continue using the app.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={
                        async () => {
                            let updateNeeded = await VersionCheck.needUpdate();
                            Linking.openURL(updateNeeded.storeUrl)
                        }
                    }>
                        <Text style={styles.buttonText}>Update Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
export default UpdateModal;
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.DarkGrayColor
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
        color: Colors.TextGrayColor
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
});