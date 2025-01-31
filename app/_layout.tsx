import {Tabs} from "expo-router";
import {COLORS} from "@/constants/colors";
import {Ionicons} from "@expo/vector-icons";

export default function RootLayout() {
    return <Tabs screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
            backgroundColor: COLORS.background
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        tabBarStyle: {
            backgroundColor: COLORS.background,
            borderTopColor: COLORS.text,
            borderTopWidth: 1
        },
        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: COLORS.inactive,
    }}>
        <Tabs.Screen name="films"
                     options={
                         {
                             title: "All Films",
                             tabBarLabel: "Films",
                             headerShown: false,
                             tabBarIcon: ({color, size}: {
                                 color: string,
                                 size: number
                             }) => {
                                 return <Ionicons name="film-outline" size={size} color={color}/>
                             }
                         }
                     }/>
        <Tabs.Screen name="people"
                     options={
                         {

                             title: "All Characters",
                             tabBarLabel: "People",
                             headerShown: false,
                             tabBarIcon: ({color, size}: {
                                 color: string,
                                 size: number
                             }) => {
                                 return <Ionicons name="people-outline" size={size} color={color}/>
                             }
                         }
                     }/>
        <Tabs.Screen name="favorites"
                     options={
                         {
                             title: "Favorites",
                             tabBarLabel: "Favorites",
                             tabBarIcon: ({color, size}) => {
                                 return <Ionicons name="heart-outline" size={size} color={color}/>
                             }
                         }
                     }/>
        <Tabs.Screen name="index" options={{
            href: null
        }}/>


    </Tabs>
}
