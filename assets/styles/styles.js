import { Dimensions, Platform } from "react-native";
import { isIphoneX } from "../../src/utility/devicecompatibility"

export const fontColors = {
	white: "white",
	black: "#000",
	blackShade2: "#1a1a1a",
	grey: "#637381",
	red: "#ca4242",
	borderColor: "#d6d4d4",
};
export const font = {
	regular: {
		fontFamily: 'Montserrat-Regular',
	},
	bold: {
		fontFamily: 'Montserrat-Bold',
	},
};
export const backgroundColors = {
	white: "white",
	blue: "#1d4e77",
	lightBlue: "#25a1da",
	DarkBlue: "#0f85c6",
	purple: "#324d8f",
	red: "#b52424",
	blueShade2: "#3b5998",
	yellow: "#f4c831",
	ligthgrey: "#f2f2f2",
	black: "#000000",
	grey: "#9f9f9f"
};
export const borderColors = {
	white: "white",
	grey: "#E0E0E0",
	black: "#000000",
	dropdownBorder: '#c4cdd5'
};

export const ButtonTextTyleWithBackground = {
	fontSize: 15,
	color: fontColors.white,
	textAlign: 'center',
	...font.bold
}
export const LoginButton = {
	width: "100%",
	height: '65%',
	backgroundColor: backgroundColors.yellow,
	justifyContent: "center"
}
export const InputBox = {
	width: "100%",
	height: Dimensions.get("window").height * 0.07,
	borderWidth: 0.6,
	borderColor: borderColors.grey,
	borderRadius: 10,
	paddingLeft: 10,
	color: fontColors.black
}
export const PasswordToggleIcon = {
	position: 'absolute',
	top: 16,
	right: 20,
}
export const InputBoxHeaderText = {
	fontSize: 15,
	color: fontColors.grey,
	marginBottom: 13,
	...font.regular
}
export const LogoContainer = {
	flex: 0.1,
	alignSelf: isIphoneX() ? "flex-end" : "center",
	justifyContent: "center",
	height: isIphoneX() ? "50%" : "100%",
}
export const Logo = {
	resizeMode: "contain",
	alignSelf: "center",
	width: 30,
	height: 30,
}


// Main Screen Style ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const TapContainer = {
	flex: 1,
	backgroundColor: 'white',
}
export const LogoContainerHeader = {
	flex: 0.1,
	// height: isIphoneX() ? "50%" : "100%",
	width: "95%",
	height: "100%",
	alignSelf: "center",
	marginTop: '22%',
	marginBottom: 115
}
export const LogoHeader = {
	alignSelf: "center",
	width: '90%',
	height: 138,
}
export const HealthLogoContainerHeader = {
	alignSelf: "center",
	width: "95%",
}
export const HealthLogoHeader = {
	alignSelf: "center",
	width: '100%',
	height: 300,
	resizeMode: "contain",
}
export const HealthCardText = {
	fontSize: 6, color: 'white', paddingTop: 4, paddingLeft: 2, ...font.bold
}
export const HealthCardText2 = {
	fontSize: 6, color: 'white', paddingTop: 0, paddingLeft: 2, ...font.bold
}
export const CardStyle = {
	width: '48%',
	// paddingRight:5,
	// height:90,
}
export const CardStyle1 = {
	width: '30%'
}
export const CardStyle2 = {
	right: 5,
	position: 'absolute'
}
export const CardStyle3 = {
	right: 5,
	height: 100,
	position: 'absolute',
	width: '48%'
}
export const CardStyle4 = {
	width: '32%',
	marginLeft: 4,
	// height:'60%'

}
export const CardStyle5 = {
	width: '32%',
	marginLeft: 4,
	height: 100

}
export const CardStyle6 = {
	width: '32%',
	marginLeft: 4,
}
export const listCover = {
	fontSize: 5.5, color: 'white', ...font.bold
}
export const CardTopPart = {
	backgroundColor: backgroundColors.blue,
	paddingLeft: 30, paddingRight: 30, paddingTop: 8,
	borderTopLeftRadius: 3, borderTopRightRadius: 3, height: 40
}
export const CartBottomPart = {
	backgroundColor: backgroundColors.white,
	// paddingLeft: 35, paddingRight: 35, paddingBottom: 0,
	paddingTop: 8,
	borderBottomLeftRadius: 3, borderBottomRightRadius: 3, height: 60
}
export const claimText = {
	color: 'white', textAlign: 'center', fontSize: 12, paddingBottom: 0, ...font.bold
}
export const TopTextStyle = {
	color: fontColors.white, textAlign: 'center',
	fontSize: 12, ...font.bold
}
export const BottomTextStyle = {
	textAlign: 'center', fontSize: 11, ...font.bold, color: fontColors.grey,
}
export const BottomTextStyle2 = {
	textAlign: 'center', fontSize: 11,
	paddingTop: 4,
	paddingBottom: 3,
	color: fontColors.grey, ...font.regular
}
export const BorderCardStyle = {
	backgroundColor: backgroundColors.blue, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5,
	height: 100
}

export const secondViewCard = {
	width: '100%', flexDirection: 'row', paddingLeft: 5, alignContent: 'center', marginTop: 15, height: 100
}
export const LastCardStyle = {
	backgroundColor: backgroundColors.blue, borderRadius: 5, paddingBottom: 0, height: 100
}
export const LastCardText = {
	color: 'white', textAlign: 'center', fontSize: 12, paddingTop: 10, ...font.bold
}
export const LastCardText2 = {
	color: 'white', textAlign: 'center', fontSize: 12, paddingBottom: 1.9, ...font.bold
}

export const loadingLoadder = {
	position: "absolute",
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundColor: 'white',
	opacity: 0.7,
	justifyContent: "center",
	alignItems: "center",
	width: '100%'


}
// Listing Screen Style ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const tabBar = {
	backgroundColor: backgroundColors.blue,
	padding: 2
	// borderBottomWidth: 1,
	// borderColor: AppStyles.color.borderGrey,
}
export const listingCard = {
	backgroundColor: "white",
	width: '98%',
	alignSelf: 'center',
	marginTop: 10,
}



//Reimburesemnet Screen Style ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const reimbursementCard = {
	backgroundColor: "white",
	width: '99%',
	alignSelf: 'center',
	marginTop: 15,
	marginBottom: 4,
}
export const headerStyle = {
	flexDirection: 'row', width: '100%'
	, paddingTop: 10,
	paddingLeft: 18,
	backgroundColor: backgroundColors.blue,
	borderTopLeftRadius: 12, borderTopRightRadius: 12,
	paddingBottom: 7
}
export const headerText = {
	fontSize: 15, ...font.bold,
	color: 'white', paddingTop: 3
}
export const benefitView = {
	width: '23%', paddingTop: 10, paddingLeft: 17
}
export const benefitText = {
	fontSize: 14, ...font.bold, color: fontColors.grey
}
export const benefitTextItem = {
	fontSize: 14, ...font.regular, color: fontColors.grey,
}
export const mainViewContact = {
	width: '100%', flexDirection: 'row', marginBottom: 5
}
export const secondViewContact = {
	width: '60%', paddingTop: 0, paddingLeft: 17
}
export const firstTextContact = {
	...font.bold, fontSize: 14, paddingTop: 5, color: fontColors.grey
}
export const relationItem = {
	...font.regular, fontSize: 14, paddingTop: 5, paddingLeft: 5, color: fontColors.grey,
}
export const badgeStyle = {
	fontSize: 10,
	color: 'white',

	borderRadius: 4,
	marginTop: 5,
	...font.bold
}
export const badge = {
	// position: 'absolute', left: 0, top: 32, 
	fontSize: 10,
	color: 'white',
	backgroundColor: 'orange',
	fontWeight: 'bold',
	borderRadius: 4,
	marginTop: 1
}
export const contributionView = {
	borderWidth: 1, borderColor: borderColors.grey,
	alignSelf: 'center', borderRadius: 8, marginTop: 2
}
export const contributionText = {
	fontSize: 14, ...font.bold,
	paddingLeft: 25, paddingRight: 30,
	paddingBottom: 10, paddingTop: 7, color: fontColors.grey
}
export const borderStyle = {
	borderTopWidth: 1, borderColor: borderColors.grey,
	padding: 5, alignItems: 'center'
}


//DETAILSCREEN STYLING
export const badgeDetailScreen = {
	position: 'absolute',
	left: 20, top: 50,
	fontSize: 12,
	color: 'white', backgroundColor: 'orange',
	fontWeight: 'bold', borderRadius: 4
}
export const UploadImage = {
	width: '40%',
	height: 350,
	marginLeft: 20,
	marginRight: 40,
	marginBottom: 20,
	borderRadius: 5
	// resizeMode:'contain',
	//  marginLeft:-90
}
export const mainViewDetail = {
	width: '100%', paddingLeft: 20, paddingTop: 20
}
export const mainViewDetail2 = {
	width: '100%', paddingLeft: 20, paddingTop: 20
}
export const firstTextDetailView = {
	fontSize: 15, paddingBottom: 10, ...font.regular, color: fontColors.grey
}
export const firstTextDetailView2 = {
	fontSize: 15, color: fontColors.grey, ...font.regular
}
//  PROFILE SCREEN STYLE ////////////////////////////////////////////////////////////////////////////////////
export const profileHeader = {
	backgroundColor: backgroundColors.blue,
}
export const profileHeaderContent = {
	padding: 30,
	alignItems: 'center',
}
export const avatar = {
	width: 130,
	height: 130,
	borderRadius: 63,
	borderWidth: 4,
	borderColor: '#FFFFFF',
	marginBottom: 10,
}
export const attachmentAvatar = {
	width: 130,
	height: 130,
	borderRadius: 10,
	borderWidth: 4,
	borderColor: '#FFFFFF',
	marginBottom: 10,
}
export const profileName = {
	fontSize: 15,
	color: '#FFFFFF',
	...font.bold
}
export const profileCard = {
	backgroundColor: backgroundColors.white,
	marginTop: 12,
	paddingTop: 10, paddingBottom: 15
}
export const profileMainView = {
	width: '100%',
	paddingLeft: 10,
}
export const profileCardFirstPart = {
	width: '100%', flexDirection: 'row',
}
export const profileCardFont1 = {
	fontSize: 12,
	paddingTop: 5,
	width: '50%',
	...font.regular,
	color: fontColors.grey
}
export const profileCardFont2 = {
	fontSize: 12, width: '70%', paddingTop: 5, ...font.regular,	color: fontColors.grey

}
export const profileCardSecondPart = {
	width: '100%', flexDirection: 'row'
}
export const profileSecondCardView = {
	backgroundColor: 'white', borderBottomLeftRadius: 9, borderBottomRightRadius: 9, paddingBottom: 12,
}
export const cardViewBackgroundColor = {
	backgroundColor: backgroundColors.blue,
	paddingLeft: 20, paddingBottom: 10,
	paddingTop: 10, borderTopLeftRadius: 9,
	borderTopRightRadius: 9

}
export const secondCardInner = {
	paddingLeft: 25, paddingTop: 10, flexDirection: 'row', width: '100%'
}

//Claim screen////////////////
export const errorText = {
	color: 'red',
	padding: 7
}
export const errorText2 = {
	color: 'red',
	padding: 3,
	paddingLeft: 43
}
export const subText = {
	// fontWeight: '700',
	fontSize: 15,
	color: fontColors.grey, ...font.bold
}
export const mainView = {
	margin: 11,
	//   alignItems: 'flex-end',
	marginBottom: 15,
	zIndex: 1000
}
export const dropdown = {
	// height: 60,
	borderColor: borderColors.dropdownBorder,
	borderWidth: 0.5,
	// borderRadius: 4,
	// paddingHorizontal: 7,
	// marginTop: 10,

}
export const container = {
	flex: 1,
	backgroundColor: backgroundColors.white
}
export const dropdownConatiner = {
	borderRadius: 10,
	borderColor: borderColors.dropdownBorder,
	// padding: 12,
	// margin: 20,
	// flexDirection: 'row',
	// alignItems: 'center',
	paddingRight: 15,
	marginVertical: 10,
	width: '100%',
	// zIndex: 100,
}

export const inputSearchStyle = {
	height: 30,
	fontSize: 15,
	color: fontColors.black
}
export const selectedTextStyle = {
	fontSize: 15,
	color: fontColors.black
}
export const iconStyle = {
	width: 55,
	height: 55,
}
export const placeholderStyle = {
	fontSize: 14,
	color: '#444444'
}
export const claimFormTextInput = {
	width: "100%",
	height: Dimensions.get("window").height * 0.07,
	borderWidth: 0.6,
	borderColor: borderColors.grey,
	borderRadius: 10,
	paddingLeft: 10,
	color: fontColors.black
}
export const remarkTextInput = {
	width: "100%",
	height: 120,
	borderWidth: 0.6,
	borderColor: borderColors.dropdownBorder,
	borderRadius: Platform.OS === "ios" ? isIphoneX() ? 10 : 7 : 10,
	paddingLeft: 10,
	color: fontColors.black,
	paddingTop: 10
}

// Setting Screen Style ////////////////////////////////////////////////////////////
export const main_title = {
	fontSize: 20,
	marginTop: 0,
	padding: 5,
	borderRadius: 20,
}
export const icon2_ = {
	color: backgroundColors.blue,
	fontSize: 20,
	marginTop: 2,
}



