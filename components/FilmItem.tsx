import {Film} from "@/types/film";
import {Text, StyleSheet, View, TouchableOpacity, Image} from "react-native";
import {COLORS} from "@/constants/colors";
import {Link} from "expo-router";

const FilmItem = ({item}: { item: Film }) => {
    const id = item.url.split('/').filter(Boolean).pop();

    return (
        <Link href={`/films/${id}`} asChild={true}>
            <TouchableOpacity>
                <View style={styles.filmItem}>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.filmTitle}>{item.title}</Text>
                        <Text style={styles.filmDetails}>🎬 Episode {item.episode_id}</Text>
                        <Text style={styles.filmDetails}>📅 Released: {item.release_date}</Text>
                    </View>

                    <Image
                        source={{uri: `https://starwars-visualguide.com/assets/img/films/${id}.jpg`}}
                        style={styles.filmImage}
                        resizeMode="cover"
                        defaultSource={require("@/assets/images/react-logo.png")}
                    />
                </View>
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    filmItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.itemBackground,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    detailsContainer: {
        flex: 1,
        paddingRight: 10,
    },
    filmTitle: {
        fontSize: 20,
        color: COLORS.text,
        fontWeight: "bold",
        marginBottom: 6,
    },
    filmDetails: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    filmImage: {
        width: 90,
        height: 120,
        borderRadius: 8,
    },
});

export default FilmItem;
