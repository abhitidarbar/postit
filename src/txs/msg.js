import Config from "../config/config";

export default function generateMessage(caller, method, args) {
  const message = {
    type: "/vm.m_call",
    value: {
      caller: caller, // your Adena address
      send: "",
      pkg_path: Config.GNO_POSTIT_REALM, // Gnoland package path
      func: method, // Function name
      args: args,
    },
  };
  return message;
}
