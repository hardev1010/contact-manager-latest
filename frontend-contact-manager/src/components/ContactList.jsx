import React, { useEffect, useState, useCallback } from "react";
import { fetchContacts, deleteContact } from "../api/api";
import ContactForm from "./ContactForm";
import Header from "./Header";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [shouldReload, setShouldReload] = useState(false); //for re rendering contacts when added or created

  const user = localStorage.getItem("user");
  //   console.log('user========', user);

  useEffect(() => {
    const loadContacts = async () => {
      const { data } = await fetchContacts();
      setContacts(data.data);
      // console.log("contacts", data.data);
    };
    loadContacts();
  }, [shouldReload]);

// function when a contact is created or updated
const handleContactChange = () => {
    setShouldReload(!shouldReload); // Toggle to trigger useEffect
};


  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleAddContact = () => {
    setEditingContact(null); // Clear editing contact for a new contact
    handleContactChange() //to render updated/added contact
    console.log("add krta ", shouldReload);
    
    setIsModalOpen(true); // Show modal
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact); // Set the contact to edit
    handleContactChange() //to render updated/added contact
    setIsModalOpen(true); // Show modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Hide modal
  };

  return (
    <>
      <Header user={user} />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Your Contacts
          </h2>

          <button
            onClick={handleAddContact}
            className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4 hover:bg-blue-600 transition-colors"
          >
            Add New Contact
          </button>
        </div>

        {contacts.length === 0 ? (
          <p className="text-center text-gray-500">No contacts available</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm flex items-center justify-between"
            >
              {/* image */}
              {contact.image && (
                <img
                  src={contact.image}
                  alt={`${contact.name}'s profile`}
                  className="w-20 h-20 object-cover rounded-full "
                />
              )}

              <h3 className="text-2xl font-medium text-gray-800">
                {contact.name}
              </h3>
              <p className="text-gray-600">{contact.email}</p>
              <p className="text-gray-600">{contact.phone}</p>
              <p className="text-gray-600">{contact.address}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEditContact(contact)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* Modal for Contact Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                &#x2715; {/* Close (X) symbol */}
              </button>
              <ContactForm
                editingContact={editingContact}
                setEditingContact={setEditingContact}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactList;
