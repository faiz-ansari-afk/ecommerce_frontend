export const getPincodeDetails = async (pincode)=>{
    // const pincodeData = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    const pincodeData = await fetch(`https://api.postalpincode.in/pincode/421302`)
    const data = await pincodeData.json();
    // ////////console.log(data)
    // ////////console.log(data[0].PostOffice[0].State)
    // ////////console.log(data[0].PostOffice[0].Block)
    const city = data[0].PostOffice[0].Block
    const state = data[0].PostOffice[0].State
    return {
        city,state
    }
}
 export  function isValidPinCode(str) {
    ////////console.log(str)
    // Regex to check valid
    // Pincode of India
    let regex = new RegExp(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/);
 
    // if str
    // is empty return false
    if (str == null) {
        return "false";
    }
 
    // Return true if the str
    // matched the ReGex
    if (regex.test(str) == true) {
        return "true";
    }
    else {
        return "false";
    }
}


export const states =  [
    { label: "Goa",
      value: "goa"
    },
    { label: "Maharashtra",
      value: "maharashtra"
    },
    { label: "Karnataka",
      value: "karnataka"
    },
    { label: "Gujarat",
      value: "gujarat"
    },
    { label: "Rajasthan",
      value: "rajasthan"
    },
    { label: "Madhya Pradesh",
      value: "madhya-pradesh"
    },
    { label: "Uttar Pradesh",
      value: "uttar-pradesh"
    },
    { label: "Haryana",
      value: "haryana"
    },
    { label: "Punjab",
      value: "punjab"
    },
    { label: "Jammu and Kashmir",
      value: "jammu-and-kashmir"
    },
    { label: "Himachal Pradesh",
      value: "himachal-pradesh"
    },
    { label: "Chandigarh",
      value: "chandigarh"
    },
    { label: "Uttarakhand",
      value: "uttarakhand"
    },
    { label: "Sikkim",
      value: "sikkim"
    },
    { label: "Arunachal Pradesh",
      value: "arunachal-pradesh"
    },
    { label: "Nagaland",
      value: "nagaland"
    },
    { label: "Manipur",
      value: "manipur"
    },
    { label: "Mizoram",
      value: "mizoram"
    },
    { label: "Tripura",
      value: "tripura"
    },
    { label: "Meghalaya",
      value: "meghalaya"
    },
    { label: "Assam",
      value: "assam"
    },
    { label: "West Bengal",
      value: "west-bengal"
    },
    { label: "Bihar",
      value: "bihar"
    },
    { label: "Jharkhand",
      value: "jharkhand"
    },
    { label: "Odisha",
      value: "odisha"
    },
    { label: "Andhra Pradesh",
      value: "andhra-pradesh"
    },
    { label: "Telangana",
      value: "telangana"
    },
    { label: "Kerala",
      value: "kerala"
    },
    { label: "Tamil Nadu",
      value: "tamil-nadu"
    },
    { label: "Puducherry",
      value: "puducherry"
    },
    { label: "Andaman and Nicobar Islands",
      value: "andaman-and-nicobar-islands"
    },
    { label: "Lakshadweep",
      value: "lakshadweep"
    }
  ]