import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const tab2 = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white'}}>
        <View style= {{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, margin: 16}}>
          <Text style={ { fontSize: 30, borderWidth: 1, margin: 16}}>Test Text</Text>
        </View>
        
        {/* <Modal transparent={true} visible={true} style={{borderWidth: 2, borderColor: 'orangered'}}>
        <TouchableWithoutFeedback style={{borderWidth: 2, borderColor: 'orangered', flex: 1}} onPress={()=>{console.log("press")}}>
            <View style= {{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
            <TouchableWithoutFeedback style={{borderWidth: 2, borderColor: 'orangered', flex: 1}} onPress={()=>{}}>
              <View style={{ backgroundColor: 'papayawhip', width: '80%',  borderRadius: 8 }}>
                <Text style={ { fontSize: 30, borderWidth: 1, margin: 16, textAlign: 'center'}}>Modal Texts</Text>
              </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default tab2;
