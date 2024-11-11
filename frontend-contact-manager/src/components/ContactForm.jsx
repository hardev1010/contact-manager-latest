import React, { useState, useEffect } from 'react';
import { createContact, updateContact } from '../api/api';
import { toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactForm = ({ editingContact, setEditingContact }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null);
    const [previwImage, setpreviewImage] = useState(null);

    useEffect(() => {
        if (editingContact) {
            setName(editingContact.name);
            setEmail(editingContact.email);
            setPhone(editingContact.phone);
            setAddress(editingContact.address);
            setImage(editingContact.image || null); 
            setpreviewImage(editingContact.image || null)
        } else {
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setImage(null);
        }
    }, [editingContact]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file); 
            setpreviewImage(URL.createObjectURL(file))// Preview the image
        }
    };        

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Form validation
        if (!image) {
            toast.error('Image is required');
            return;
        }

        if (!name) {
            toast.error('Name is required');
            return;
        }
        
        if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        
        if (!phone) {
            toast.error('Phone is required');
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            toast.error('Phone should be a 10-digit number');
            return;
        }

        if (!address) {
            toast.error('Address is required');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name.toUpperCase());
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('address', address);
            // console.log("image hai yeh", image);

            if (image) {
                formData.append('image', image); // Append the image file
                // console.log("image hai yeh", image);
                
            }

            if (editingContact) {
                // Update the contact
                // console.log("editing contact:--  ", editingContact._id, formData);
                // console.log("going to update...", editingContact, "formdata****", formData);
                
                await updateContact(editingContact._id, {name,email,address,phone,image});
                toast.success('contact updated successfully')
                console.log("updated contact");
                
            } else {
                // Create a new contact
                console.log("creating contact:--  ", formData);
                await createContact(formData);
                toast.success('contact added successfully')
            }

            setEditingContact(null);
            // closeModal();
        } catch (error) {
            toast.error('error saving contact')
            console.error('Error saving contact:', error);
        }
    };

    return (
        <>
        <ToastContainer/>
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-lg">
            {/* Image Upload Section */}
            <div className="w-full mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Profile Image</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full mt-2 text-sm text-gray-700 border border-gray-300 rounded-md file:border-none file:bg-blue-500 file:text-white file:py-2 file:px-4"
                />
                {image && (
                    <div className="mt-4">
                        <img src={previwImage} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full mx-auto" />
                    </div>
                )}
            </div>

            {/* Name Input */}
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                // required
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Email Input */}
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // required
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Phone Input */}
            <label className="block text-sm font-medium text-gray-700">phone</label>
            <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                // required
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Address Input */}
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                // required
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
            >
                {editingContact ? 'Update' : 'Add'}
            </button>
        </form>
        </>
        
    );
};

export default ContactForm;