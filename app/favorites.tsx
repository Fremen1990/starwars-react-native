import {Text, View, StyleSheet, FlatList, RefreshControl, TouchableOpacity} from "react-native";
import {useCallback, useState} from "react";
import {Film} from "@/types/film";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {FAVORITES_KEY} from "@/constants/keys";
import {COLORS} from "@/constants/colors";
import {Ionicons} from "@expo/vector-icons";
import {useFocusEffect} from "expo-router";

export default function Favorites() {
    const [favorites, setFavorites] = useState<Film[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFavorites = async () => {
        try {
            const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
            if (favorites) {
                const parsedFavorites = JSON.parse(favorites) as Film[];
                setFavorites(parsedFavorites);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setRefreshing(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [])
    );


    const onRefresh = () => {
        setRefreshing(true);
        fetchFavorites();
    }

    const removeFavorite = async (film: Film) => {
        const updatedFavorites = favorites.filter((f) => f.episode_id !== film.episode_id);
        setFavorites(updatedFavorites);
        try {
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
        } catch (e) {
            console.error(e);
        }
    }

    const renderItem = ({item}: { item: Film }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.title}</Text>
            < TouchableOpacity onPress={() => removeFavorite(item)}>
                <Ionicons name="trash-outline" size={24} color={COLORS.text}/>
            </TouchableOpacity>
        </View>
    )


    return (
        <View
            style={styles.container}
        >
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.episode_id.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.text}/>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: COLORS.containerBackground,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8
    },
    itemText: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: 'bold'
    }
})