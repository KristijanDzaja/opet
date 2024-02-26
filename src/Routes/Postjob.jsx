import React, { useState } from 'react';
import { addDoc, collection, updateDoc, arrayUnion, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


const Postjob = () => {
    const [title, setTitle] = useState('');
    const [photo, setPhoto] = useState('');
    const [salary, setSalary] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const { user: currentUser } = UserAuth(); // Rename user to currentUser


    const handlePostJob = async () => {
        try {
            // Ensure currentUser is defined
            if (!currentUser) {
                console.error('Current user is not authenticated');
                return;
            }

            // Convert salary to integer
            const salaryInt = parseInt(salary);

            // Check if salary is a valid number
            if (isNaN(salaryInt)) {
                console.error('Salary must be a number');
                return;
            }

            const jobAdsCollection = collection(db, "JobAds");

            // Add job data to Firestore with the author included
            const docRef = await addDoc(jobAdsCollection, {
                title: title,
                photo: photo,
                salary: salaryInt,
                description: description,
                author: currentUser.email,
            });

            // Update user document with published post
            const userDocRef = doc(db, "users", currentUser.email);
            const userDocSnapshot = await getDoc(userDocRef);
            const userData = userDocSnapshot.data() || {}; // Default to empty object if user document doesn't exist
            const updatedNumPublishedPosts = (userData.numPublishedPosts || 0) + 1;

            await updateDoc(userDocRef, {
                publishedPosts: arrayUnion(docRef.id), // Add the ID of the new job post to publishedPosts array
                numPublishedPosts: updatedNumPublishedPosts // Increase the number of published posts
            });

            // Reset form fields
            setTitle('');
            setPhoto('');
            setSalary('');
            setDescription('');

            console.log('Job posted successfully');
            navigate("/account");

        } catch (error) {
            console.error('Error posting job:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setPhoto(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className='max-w-[1140px] mx-auto'>
            <div className='flex justify-between items-center my-12 py-8 rounded-lg shadow-md bg-white'>
                <div>
                    <h1 className='text-3xl font-semibold text-gray-800 mb-4 ml-4'>POST A NEW JOB</h1>
                    <div>
                        <p className='text-gray-600 ml-4'>Fill out the form below to post a new job.</p>
                    </div>
                </div>
                <div>

                    <Link to="/account" className='bg-gray-500 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:bg-gray-600 focus:outline-none m-4'> Account</Link>

                    <button onClick={handlePostJob} className='bg-blue-500 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none m-4'>Post Job</button>


                </div>
            </div>

            <div className='my-12 py-8 rounded-lg shadow-md bg-white'>
                <div className='w-full max-w-lg mx-auto'>

                    {/* Title Input */}
                    <input
                        type='text'
                        placeholder='Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 mb-4'
                    />

                    {/* File Input */}
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleFileChange}
                        className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 mb-4'
                    />

                    {/* Salary Input */}
                    <input
                        type='number'
                        placeholder='Salary (USD)'
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 mb-4'
                    />

                    {/* Description Textarea */}
                    <textarea
                        placeholder='Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-40 resize-none mb-4'
                    ></textarea>

                </div>
            </div>

        </div>
    );
};

export default Postjob;
