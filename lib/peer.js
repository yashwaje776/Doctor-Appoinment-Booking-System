import Peer from "peer";

export function createPeer(id) {
  return new Peer(id, {
    debug: 2,
  });
}
