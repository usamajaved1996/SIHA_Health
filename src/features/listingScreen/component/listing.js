import React, { Component } from "react"
import { View, Text, useWindowDimensions, SafeAreaView } from "react-native"
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as styles from "../../../../assets/styles/styles"
import Reimbursed from "../component/reimbursement";
import Cashless from "../component/cashless";

const FirstRoute = () => (
	<View style={{ flex: 1, backgroundColor: '#fff' }}>
		<Reimbursed />
	</View>
);

const SecondRoute = () => (
	<View style={{ flex: 1, backgroundColor: '#fff' }}>
		<Cashless />
	</View>);
const renderScene = SceneMap({
	first: FirstRoute,
	second: SecondRoute,
});
const renderTabBar = props => {
	return (
		<TabBar
			{...props}
			renderLabel={({ focused, route }) => {
				return (
					<Text
						style={{ color: focused ? 'white' : '#b0bec9', fontWeight: '600', fontSize: 16 }}
					>
						{route.title}
					</Text>
				);
			}}
			indicatorStyle={{ backgroundColor: 'transparent' }}
			style={styles.tabBar}
		/>
	);
};
export default function TabViewExample() {
	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: 'Claims' },
		{ key: 'second', title: 'Cashless' },
	]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
				renderTabBar={renderTabBar}
			/>
		</SafeAreaView>
	);
}
