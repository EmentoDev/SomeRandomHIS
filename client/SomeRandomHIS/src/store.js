import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
                options: {},
            },
            set: (type, data, options) => set(() => ({ view: { type, data, options } })),
            remove: () => set({ view: { type: undefined, data: undefined, options: {} } }),
        }),
        {
            name: 'view-storage',
            getStorage: () => createJSONStorage(() => localStorage),
        }
    )
);
