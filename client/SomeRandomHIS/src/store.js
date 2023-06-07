import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

export const usePatientStore = create((set) => ({
    patient: undefined,
    set: (p) => set(() => ({ patient: p })),
    remove: () => set({ patient: undefined }),
}));

export const useViewStore = create(
    persist(
        (set) => ({
            view: {
                type: undefined,
                data: undefined,
            },
            set: (type, data) => set(() => ({ view: { type, data } })),
            remove: () => set({ view: { type: undefined, data: undefined } }),
        }),
        {
            name: 'view-storage',
            getStorage: () => createJSONStorage(() => localStorage),
        }
    )
);
