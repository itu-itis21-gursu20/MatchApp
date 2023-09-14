import { createSlice, current } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    //accountOwner: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout: (state) => {
        state.currentUser = null;
        state.isFetching = false;
        state.error = false;
    },
    // setAccountOwner: (state, action) => {
    //   state.accountOwner = action.payload;
    // },
    // resetAccountOwner: (state) => {
    //   state.accountOwner = null;
    // },   
    
    
    // ben taliscayı takipten çıkıcam
    // currentUser.followedUsers arrayinde id yi çıkarıcam
    // accountOwner.followers arrayinde curretUserın idsini çıkarıcam
    following: (state, action) => { // action.payloaddaki id accountOwnerın idsi
      console.log("following redux");
      state.currentUser.followedUsers.push(action.payload.id);
    },
    
    unfollowing: (state, action) => {
      console.log("unfollowing redux");
        state.currentUser.followedUsers.splice(
          state.currentUser.followedUsers.findIndex(
            (id) => id === action.payload.id
          ),
          1
        );
    },

    // following: (state, action) => { // action.payloaddaki id accountOwnerın idsi
      
    //   if (state.currentUser.followedUsers.includes(action.payload.id)) { // zaten varsa unfollowing
    //     state.currentUser.followedUsers.splice(
    //       state.currentUser.followedUsers.findIndex(
    //         (id) => id === action.payload.id
    //       ),
    //       1
    //     );
    //   } else { // yoksa following
    //     state.currentUser.followedUsers.push(action.payload.id);
    //   }
    // },  
  

  //     // furkan
  //     followingAboutSender: (state, action) => {
  //       if (state.currentUser.followedUsers.includes(action.payload.id)) { 
  //           // If furkan already follows berkay, remove berkay from furkan's following list
  //           state.currentUser.followedUsers.splice(
  //               state.currentUser.followedUsers.findIndex(
  //                   (id) => id === action.payload.id
  //               ),
  //               1
  //           );
  //           state.accountOwner.followers.splice(
  //             state.accountOwner.followers.findIndex(
  //                 (id) => id === action.payload.currentUserId
  //             ),
  //             1
  //         );
  //       } else { 
  //           // If furkan doesn't already follow berkay, add berkay to furkan's following list
  //           state.accountOwner.followers.push(action.payload.currentUserId);
  //           state.currentUser.followedUsers.push(action.payload.id);
  //       }
  //   }
    
 
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, following, unfollowing, setAccountOwner, resetAccountOwner} = userSlice.actions;
export default userSlice.reducer;































// following: (state, action) => { // action.payloaddaki id accountOwnerın idsi
//   if(action.payload.type === "sender") {
//     console.log("action.payload.type",action.payload.type);
//     if (state.currentUser.followedUsers.includes(action.payload.id)) { // zaten varsa unfollowing
//       console.log("unfollowing");
//       state.currentUser.followedUsers.splice(
//         state.currentUser.followedUsers.findIndex(
//           (id) => id === action.payload.id
//         ),
//         1
//       );
//     } else { // yoksa following
//       console.log("following");
//       state.currentUser.followedUsers.push(action.payload.id);
//     }
//   } else if(action.payload.type === "receiver"){
//     console.log("action.payload.type",action.payload.type);
//     if (state.currentUser.followedUsers.includes(action.payload.id)) { // zaten varsa unfollowing
//       state.accountOwner.followers.splice(
//         state.accountOwner.followers.findIndex(
//           (id) => id === action.payload.currentUserId
//         ),
//         1
//       );
//     } else { // yoksa following
//       console.log("following");
//       state.currentUser.followedUsers.push(action.payload.id);
//       state.accountOwner.followers.push(action.payload.currentUserId);
//     }
//   }
// },   










// following: (state, action) => {
//   if (!state.currentUser.followedUsers.includes(action.payload)) {
//     state.currentUser.followedUsers.push(action.payload);
//     state.currentUser.followedUsersNumber++;
//   } 
// },