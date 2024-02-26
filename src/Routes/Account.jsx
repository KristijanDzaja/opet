import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, doc, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';

const Account = () => {
    const { user, setUser } = UserAuth(); // Assuming setUser is provided by your context
    const [userJobAds, setUserJobAds] = useState([]);


    useEffect(() => {
        const fetchUserJobAds = async () => {
            try {
                if (user && user.email) { // Add a check for user.email
                    // Query the JobAds collection for job ads posted by the current user
                    const q = query(collection(db, 'JobAds'), where('author', '==', user.email));
                    const querySnapshot = await getDocs(q);
                    const userJobAdsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setUserJobAds(userJobAdsData);
                }
            } catch (error) {
                console.error('Error fetching user job ads:', error);
            }
        };

        fetchUserJobAds();
    }, [user]);


    const deletePost = async (id) => {
        try {
            // Construct a reference to the document to be deleted
            const postDoc = doc(db, "JobAds", id);
            // Delete the document from Firestore
            await deleteDoc(postDoc);
            // After successful deletion, update the userJobAds state to remove the deleted post
            setUserJobAds(prevJobAds => prevJobAds.filter(jobAd => jobAd.id !== id));
            console.log('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };


    return (
        <div className='max-w-[1140px] mx-auto'>
            <div className='flex justify-between items-center my-12 py-8 rounded-div'>
                <div>
                    <h1 className='text-2xl font-bold'>Account</h1>
                    <div>
                        <p className='italic'>{user?.email}</p>
                    </div>
                </div>

            </div>
            <div className='flex justify-center items-center my-12'>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {userJobAds.map(jobAd => (
                        <div key={jobAd.id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-center m-2">{jobAd.title}</h2>
                            <img src={jobAd.photo} alt='Job Image' className='w-full h-64 object-cover rounded-t-lg' />
                            <p className="text-gray-600 mt-2">{jobAd.description}</p>
                            <p className="text-gray-500 mt-4 mb-4 italic">Salary:  ${jobAd.salary}</p>
                            <div className="flex justify-center space-x-4">
                                <Link
                                    to={`/edit/${jobAd.id}`}
                                    className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => deletePost(jobAd.id)}
                                    className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md'
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Account;
