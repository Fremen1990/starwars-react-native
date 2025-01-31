import {View, StyleSheet, FlatList, RefreshControl} from "react-native";
import {COLORS} from "@/constants/colors";
import {useEffect, useState} from "react";
import {Film} from "@/types/film";
import FilmItem from "@/components/FilmItem";
import ListEmptyComponent from "@/components/ListEmptyComponent";


export default function Films() {
    const [films, setFilms] = useState<Film[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchFilms = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://swapi.dev/api/films/');
            const data = await response.json();
            console.log("?? ~ fetchFilms ~ data", data)
            setFilms(data.results);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }


    useEffect(() => {
        fetchFilms();
    }, []);


    const onRefresh = () => {
        setRefreshing(true);
        fetchFilms();
    }

    return (
        <View
            style={styles.container}
        >
            <FlatList
                data={films}
                keyExtractor={(item) => item.episode_id.toString()}
                renderItem={({item}) => (
                    < FilmItem item={item}/>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.text}/>
                }
                ListEmptyComponent={
                    <ListEmptyComponent loading={loading} message="No films found"/>
                }
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    item: {
        color: COLORS.text,
    },
})