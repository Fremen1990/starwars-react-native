import {Person} from "@/types/people";
import {Link} from "expo-router";
import {Text, TouchableOpacity, View, StyleSheet, Image} from "react-native";
import {COLORS} from "@/constants/colors";

const PeopleItem = ({item}: { item: Person }) => {
    const id = item.url.split('/').filter(Boolean).pop();

    return (
        <Link href={`/people/${id}` } asChild={true}>
            <TouchableOpacity>
                <View style={styles.peopleItem}>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.peopleName}>{item.name}</Text>
                        <Text style={styles.peopleDetails}>🧑 Gender: {item.gender}</Text>
                        <Text style={styles.peopleDetails}>🎂 Birth Year: {item.birth_year}</Text>
                    </View>

                    <Image
                        source={{uri: `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}}
                        style={styles.peopleImage}
                        resizeMode="cover"
                        defaultSource={require("@/assets/images/react-logo.png")}
                    />
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default PeopleItem;

const styles = StyleSheet.create({
    peopleItem: {
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
    peopleName: {
        fontSize: 20,
        color: COLORS.text,
        fontWeight: "bold",
        marginBottom: 6,
    },
    peopleDetails: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    peopleImage: {
        width: 80,
        height: 100,
        borderRadius: 8,
    },
});
