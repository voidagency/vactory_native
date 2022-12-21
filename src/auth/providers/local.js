const getLocalTestUser = ({
  name = "John Doe",
  expire = 60 * 15, // 15 mins,
  uid = 0,
  imageProfile = "https://images.unsplash.com/photo-1640951613773-54706e06851d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
} = {}) => {
  return {
    id_token: "id_token",
    session_state: "session_state",
    access_token: "access_token",
    refresh_token: "refresh_token",
    token_type: "bearer",
    scope: "scope",
    profile: {
      id: uid,
      uuid: "7e20ce4d-b229-4e45-aa2d-65359215aafe",
      email: "johndoe@void.fr",
      username: "johndoe@void.fr",
      avatar: imageProfile,
      first_name: "John",
      last_name: "Doe",
      full_name: name,
      name_initial: "HB",
      roles: ["authenticated"],
      isActive: true,
      isBlocked: false,
      sub: "29",
    },
    expires_at: parseInt(Date.now() / 1000 + expire), // 30 seconds
    state: "state",
    provider: "local",
  };
};

function getMockLocalUsers() {
  return {
    john: getLocalTestUser({
      name: "John Doe",
      expire: 60 * 15, // 15 mins,
      uid: 0,
      imageProfile:
        "https://images.unsplash.com/photo-1640951613773-54706e06851d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
    }),
    jane: getLocalTestUser({
      name: "Jane Doe",
      expire: 10, // 10 secs,
      uid: 2,
      imageProfile:
        "https://images.unsplash.com/photo-1484399172022-72a90b12e3c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80",
    }),
  };
}

export default function (options) {
  return {
    id: "local",
    name: "Local",
    type: "local",
    authorize: async (config) => {
      const { userId } = config;
      const users = getMockLocalUsers();
      return Promise.resolve(users[userId]);
    },
    options,
  };
}
