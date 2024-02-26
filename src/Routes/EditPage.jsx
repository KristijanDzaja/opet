import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const EditPage = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: ''
    });

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const jobDoc = await getDoc(doc(db, 'JobAds', id));
                if (jobDoc.exists()) {
                    setFormData({
                        title: jobDoc.data().title,
                        description: jobDoc.data().description,
                        salary: jobDoc.data().salary
                    });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching job data:', error);
            }
        };

        fetchJobData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            // Handle file selection
            const selectedFile = files[0];
            setFormData(prevState => ({
                ...prevState,
                [name]: selectedFile
            }));
        } else {
            // Handle other input changes
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'JobAds', id), {
                title: formData.title,
                description: formData.description,
                salary: formData.salary
                // Add other fields as needed
            });
            console.log('Document successfully updated!');
            navigate("/account");
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    return (
        <div className='max-w-[1140px] mx-auto'>
            <div className='flex justify-between items-center my-12 py-8 rounded-lg shadow-md bg-white'>
                <div>
                    <h1 className='text-3xl font-semibold text-gray-800 mb-4 ml-4'>Edit job!</h1>
                    <div>
                        <p className='text-gray-600 ml-4'>Update the form below to edit ad you posted.</p>
                    </div>
                </div>
                <div>

                    <Link to="/account" className='bg-gray-500 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:bg-gray-600 focus:outline-none m-4'> Account</Link>

                    <button onClick={handleSubmit} className='bg-blue-500 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none m-4'>Submit </button>


                </div>
            </div>

            <div className='my-12 py-8 rounded-lg shadow-md bg-white'>
                <div className='w-full max-w-lg mx-auto'>

                    {/* Title Input */}
                    <input
                        type='text'
                        name='title'
                        value={formData.title}
                        onChange={handleInputChange}
                        className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 mb-4'
                    />

                    {/* File Input */}
                    {/* <input
                        type='file'
                        accept='image/*'
                        value={formData.photo}
                        onChange={handleInputChange}
                        className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 mb-4'
                    /> */}

                    {/* Salary Input */}
                    <input
                        type='number'
                        placeholder='Salary (USD)'
                        name='salary'
                        value={formData.salary}
                        onChange={handleInputChange}
                        className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 mb-4'
                    />

                    {/* Description Textarea */}
                    <textarea
                        placeholder='Description'
                        name='description'
                        value={formData.description}
                        onChange={handleInputChange}
                        className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-40 resize-none mb-4'
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default EditPage;
