import { create } from "zustand";

const useAUthStore = create((set) => ({
  firstName: "",
  lastName: "",
  email: "",
  id: "",
  setUserFirstName: (name) => set({ firstName: name }),
  setUserLastName: (name) => set({ name: name }),
  setUserEmail: (eail) => set({ lastName: eail }),
  setId: (userId) => set({ id: userId }),
  logout: () => set({ id: "", firstName: "", lastName: "", email: "" }),
}));

export default useAUthStore;
