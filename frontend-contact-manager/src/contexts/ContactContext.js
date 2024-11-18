import {createContext, useContext} from "react"

export const ContactContext = ctreateContext({
    contacts: [],

})

export const useContact = () => {
    return useContext(ContactContext)
}

export const ContactProvider = ContactContext.provider