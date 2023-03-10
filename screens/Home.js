import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Alert } from 'react-native';
import { Card, FAB } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'

import { MyContext } from '../App'

const Home = ({ navigation }) => {

    // const [data, setData] = useState([])
    // const [loading, setLoading] = useState(true)
    // const dispatch = useDispatch()
    // const { data, loading } = useSelector((state) => {
    //     return state

    // })

    const { state, dispatch } = useContext(MyContext)
    const { data, loading } = state


    const fetchData = () => {
        fetch("http://192.168.0.59:3000/")
            .then(res => res.json())
            .then(results => {

                // setData(results)
                // setLoading(false)

                dispatch({ type: "ADD_DATA", payload: results })
                dispatch({ type: "SET_LOADING", payload: false })
            }).catch(err => {
                Alert.alert("something went wrong")
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const renderList = ((item) => {
        return (
            <Card style={styles.myCard}
                onPress={() => navigation.navigate("Profile", { item })}
            >
                <View style={styles.cardView}>
                    <Image
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                        source={{ uri: item.picture }}
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text style={styles.text}>{item.position}</Text>
                    </View>

                </View>
            </Card>
        )

    })

    return (
        <View style={{ flex: 1 }}>

            <FlatList
                data={data}
                keyExtractor={item => item._id}
                renderItem={({ item }) => {
                    return renderList(item)
                }}
                onRefresh={() => fetchData()}
                refreshing={loading}
            />
            <FAB
                onPress={() => navigation.navigate("Create")}
                style={styles.fab}
                small={false}
                icon="plus"
                theme={{ colors: { accent: '#006aff' } }}
            />

        </View>


    )
}

const styles = StyleSheet.create({
    myCard: {
        margin: 5
    },
    cardView: {
        flexDirection: 'row',
        padding: 6
    },
    text: {
        fontSize: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})

export default Home