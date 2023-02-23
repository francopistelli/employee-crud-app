import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const CreateEmployee = ({ navigation, route }) => {

    const getDetails = (type) => {
        if (route.params) {
            switch (type) {
                case "name":
                    return route.params.name
                case "phone":
                    return route.params.phone
                case "email":
                    return route.params.email
                case "salary":
                    return route.params.salary
                case "picture":
                    return route.params.picture
                case "position":
                    return route.params.position
            }

        }

        return ""
    }


    const [name, setName] = useState(getDetails("name"))
    const [phone, setPhone] = useState(getDetails("phone"))
    const [email, setEmail] = useState(getDetails("email"))
    const [salary, setSalary] = useState(getDetails("salary"))
    const [picture, setPicture] = useState(getDetails("picture"))
    const [position, setPosition] = useState(getDetails("position"))
    const [modal, setModal] = useState(false)
    const [enableShift, setEnableShift] = useState(false)



    const submitData = () => {
        fetch("http://192.168.0.59:3000/send-data", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                salary,
                picture,
                position
            })
        })
            .then(res => res.json())
            .then(data => {
                Alert.alert(`${data.name} is saved successfuly`)
                navigation.navigate("Home")
            }).catch(err => {
                Alert.alert("something went wrong")
            })
    }

    const updateDetails = () => {
        fetch("http://192.168.0.59:3000/update", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id:route.params._id,
                name,
                email,
                phone,
                salary,
                picture,
                position
            })
        })
            .then(res => res.json())
            .then(data => {
                Alert.alert(`${data.name} is updated successfuly`)
                navigation.navigate("Home")
            }).catch(err => {
                Alert.alert("something went wrong")
            })

    }


    const picFromGallery = async () => {
        const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        if (granted) {
            let data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: .5
            })
            if (!data.cancelled) {
                let newFile = {
                    uri: data.uri,
                    type: `test/${data.uri.split(".")[1]}`,
                    name: `test.${data.uri.split(".")[1]}`
                }
                handleUpload(newFile)
            }
        } else {
            Alert.alert("you need to give up persmissions to work")
        }
    }

    const picFromCamera = async () => {
        const { granted } = await Permissions.askAsync(Permissions.CAMERA)
        if (granted) {
            let data = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: .5
            })
            if (!data.cancelled) {
                let newFile = {
                    uri: data.uri,
                    type: `test/${data.uri.split(".")[1]}`,
                    name: `test.${data.uri.split(".")[1]}`
                }
                handleUpload(newFile)
            }
        } else {
            Alert.alert("you need to give up persmissions to work")
        }
    }

    const handleUpload = (image) => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'employeeApp')
        data.append('cloud_name', 'dhasnvhi0')

        fetch("https://api.cloudinary.com/v1_1/dhasnvhi0/image/upload", {
            method: 'post',
            body: data
        }).then(res => res.json())
            .then(data => {
                setPicture(data.url)
                setModal(false)
            }).catch(err => {
                Alert.alert("error while uploading")
            })

    }

    return (
        <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableShift} >
        <View >
            <TextInput
                style={styles.inputStyle}
                theme={theme}
                label="Name"
                onFocus={() => setEnableShift(false)}
                value={name}
                mode="outlined"
                onChangeText={text => setName(text)}
            />
            <TextInput
                style={styles.inputStyle}
                theme={theme}
                label="Email"
                onFocus={() => setEnableShift(false)}
                value={email}
                mode="outlined"
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                style={styles.inputStyle}
                theme={theme}
                label="phone"
                onFocus={() => setEnableShift(false)}
                value={phone}
                mode="outlined"
                keyboardType="number-pad"
                onChangeText={text => setPhone(text)}
            />
            <TextInput
                style={styles.inputStyle}
                theme={theme}
                label="salary"
                value={salary}
                onFocus={() => setEnableShift(true)}
                mode="outlined"
                onChangeText={text => setSalary(text)}
            />
            <TextInput
                style={styles.inputStyle}
                theme={theme}
                label="position"
                value={position}
                onFocus={() => setEnableShift(true)}
                mode="outlined"
                onChangeText={text => setPosition(text)}
            />
            <Button
                style={styles.inputStyle}
                icon={picture == "" ? "upload" : "check"}
                mode="contained"
                theme={theme}
                onPress={() => setModal(true)}>
                Upload Image
             </Button>
            {route.params ?
                <Button
                    style={styles.inputStyle}
                    icon="content-save"
                    mode="contained"
                    theme={theme}
                    onPress={() => updateDetails()}>
                    Update details
                </Button>
                :
                <Button
                    style={styles.inputStyle}
                    icon="content-save"
                    mode="contained"
                    theme={theme}
                    onPress={() => submitData()}>
                    save
                </Button>
            }

            <Modal
                animationType='slide'
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                    setModal(false)
                }}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalButtonView}>
                        <Button
                            icon="camera"
                            mode="contained"
                            theme={theme}
                            onPress={() => picFromCamera()}>
                            camera
                        </Button>
                        <Button
                            icon="image-area"
                            mode="contained"
                            theme={theme}
                            onPress={() => picFromGallery()}>
                            gallery
                        </Button>
                    </View>
                    <Button
                        theme={theme}
                        onPress={() => setModal(false)}>
                        cancel
                    </Button>
                </View>
            </Modal>
        </View>
        </KeyboardAvoidingView>
    )
}

const theme = {
    colors: {
        primary: "#006aff"
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    inputStyle: {
        margin: 5
    },
    modalButtonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    modalView: {
        position: 'absolute',
        bottom: 2,
        width: '100%',
        backgroundColor: "white"
    }
})

export default CreateEmployee