export default function(options) {
  return {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    credentials: {},
    authorize: async () => null,
    options,
  };
};
