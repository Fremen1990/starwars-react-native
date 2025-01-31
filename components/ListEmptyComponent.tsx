import {View, Text, StyleSheet, ActivityIndicator} from "react-native";
import {COLORS} from "@/constants/colors";

interface ListEmptyComponentProps {
    loading: boolean;
    message?: string;
}

const ListEmptyComponent = ({loading, message = "No items found"}: ListEmptyComponentProps) => {
    return (
        <View style={styles.emptyContainer}>
            {loading ? <ActivityIndicator size="large" color={COLORS.text}/> :
                <Text style={styles.text}>{message}</Text>
            }
        </View>
    );

}
export default ListEmptyComponent;

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 500,
    },
    text: {
        color: COLORS.inactive,
        fontSize: 20,
        padding: 10,
    }
})