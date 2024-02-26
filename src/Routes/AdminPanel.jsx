import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';

const AdminPanel = () => {
    const { user } = UserAuth();
    const [jobAds, setJobAds] = useState([]);

    useEffect(() => {
        const fetchJobAds = async () => {
            try {
                const q = query(collection(db, 'JobAds'));
                const querySnapshot = await getDocs(q);
                const jobAdsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setJobAds(jobAdsData);
            } catch (error) {
                console.error('Error fetching job ads:', error);
            }
        };

        fetchJobAds();
    }, []);

    const handleDeletePost = async (postId) => {
        try {
            await deleteDoc(doc(db, 'JobAds', postId));
            setJobAds(jobAds.filter(ad => ad.id !== postId));
            console.log('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div className='max-w-[1140px] mx-auto'>
            <h1 className='text-3xl font-semibold my-8'>Admin Panel</h1>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {jobAds.map(jobAd => (
                    <div key={jobAd.id} className='bg-white rounded-lg shadow-md'>
                        <img src={jobAd.photo} alt='Job Image' className='w-full h-64 object-cover rounded-t-lg' />
                        <div className='p-6'>
                            <h2 className='text-lg font-semibold mb-2'>{jobAd.title}</h2>
                            <p className='text-gray-600 mb-4'>{jobAd.description}</p>
                            <p className='text-gray-500'>Salary: {jobAd.salary}</p>
                            <p className='text-gray-500'>Posted by: {jobAd.author}</p>
                            <button
                                onClick={() => handleDeletePost(jobAd.id)}
                                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-4 rounded-md'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPanel;
