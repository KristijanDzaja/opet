import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';

const Home = () => {
    const [jobAds, setJobAds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState(''); // State to track the sorting option

    useEffect(() => {
        // Fetch job ads from Firestore
        const fetchJobAds = async () => {
            try {
                // Create a Firestore query for the JobAds collection
                let jobAdsQuery = collection(db, 'JobAds');

                // Apply sorting if sortBy state is set
                if (sortBy) {
                    jobAdsQuery = query(jobAdsQuery, orderBy('salary', sortBy));
                }

                // Execute the query
                const jobAdsSnapshot = await getDocs(jobAdsQuery);
                const jobAdsData = jobAdsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setJobAds(jobAdsData);
            } catch (error) {
                console.error('Error fetching job ads:', error);
            }
        };

        fetchJobAds();
    }, [sortBy]);

    // Filter job ads based on search query
    const filteredJobAds = jobAds.filter(jobAd =>
        jobAd.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='max-w-[1140px] mx-auto'>
            <div className='flex justify-between items-center my-12 py-8 rounded-div'>
                <div className="container mx-auto mt-8">
                    <h1 className="text-3xl font-semibold text-center mb-8">All Job Openings</h1>
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search job openings"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-primary border border-input px-4 py-2 rounded-2xl shadow-xl"
                        />
                        {/* Dropdown for sorting */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="ml-4 bg-primary border border-input px-4 py-2 rounded-2xl shadow-xl focus:outline-none"
                        >
                            <option value="">Sort by</option>
                            <option value="asc">Salary (Low to High)</option>
                            <option value="desc">Salary (High to Low)</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobAds.map(jobAd => (
                            <div key={jobAd.id} className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-bold text-center m-2">{jobAd.title}</h2>
                                <h2 className="text-lg font-semibold"><img src={jobAd.photo} alt="images" /></h2>
                                <p className="text-gray-600 mt-2 italic">Contact: {jobAd.author}</p>
                                <p className="text-gray-600 mt-2">{jobAd.description}</p>
                                <p className="text-gray-500 mt-4 italic">Salary:  ${jobAd.salary}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
