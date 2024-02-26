import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import ThemeToggle from './ThemeToggle';
import { UserAuth } from '../context/AuthContext';

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    const handleNav = () => {
        setNav(!nav);
    };

    const handleSignOut = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    const isAdmin = user?.email === 'admin@jobad.ba';

    return (
        <div className='rounded-div flex items-center justify-between h-20 font-bold'>
            <Link to='/'>
                <h1 className='text-2xl p-3'>JobAd</h1>
            </Link>
            <div className='hidden md:block'>
                <ThemeToggle />
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex'>
                {user?.email ? (
                    isAdmin ? (
                        <Link to='/adminpanel' className='p-4' onClick={handleNav}>
                            Admin Panel
                        </Link>
                    ) : (
                        <>
                            <Link to='/postjob' className='p-4 mr-1'>Post a New Job</Link>
                            <Link to='/account' className='p-4 mr-2' onClick={handleNav}>
                                Account
                            </Link>
                        </>
                    )
                ) : (
                    <>
                        <Link to='/signin' className='p-4 hover:text-accent' onClick={handleNav}>
                            Sign In
                        </Link>
                        <Link
                            to='/signup'
                            className='bg-button text-btnText p-4 ml-2 rounded-2xl shadow-lg hover:shadow-2xl flex items-center'
                            onClick={handleNav}
                        >
                            <span className="mr-2">Sign Up</span>
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </>
                )}
                {user?.email && (
                    <button onClick={handleSignOut}>Sign Out</button>
                )}
            </div>

            {/* Mobile Navigation */}
            <div onClick={handleNav} className='block md:hidden cursor-pointer z-10'>
                {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>

            <div className={nav ? 'md:hidden fixed left-0 top-20 flex flex-col items-center justify-between w-full h-[90%] bg-primary ease-in duration-300 z-10' : 'fixed left-[-100%] top-20 h-[90%] flex flex-col items-center justify-between ease-in duration-300'}>
                <ul className='w-full p-4'>
                    <li onClick={handleNav} className='border-b py-6'>
                        <Link to='/'>Home</Link>
                    </li>
                    {user ? (
                        <>
                            {isAdmin ? (
                                <li onClick={handleNav} className='border-b py-6'>
                                    <Link to='/adminpanel'>Admin Panel</Link>
                                </li>
                            ) : (
                                <>
                                    <li onClick={handleNav} className='border-b py-6'>
                                        <Link to='/postjob'>Post a New Job</Link>
                                    </li>
                                    <li onClick={handleNav} className='border-b py-6'>
                                        <Link to='/account'>Account</Link>
                                    </li>
                                </>
                            )}
                            <li className=' py-6'>
                                <ThemeToggle />
                            </li>
                            <li className='flex flex-col w-full p-4'>
                                <Link onClick={handleSignOut}>
                                    <button className='w-full my-2 p-3 bg-button text-btnText rounded-2xl shadow-xl'>
                                        Sign Out
                                    </button>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li onClick={handleNav} className='mb-5  hover:shadow-2xl'>
                                <Link to='/signin'>Sign In</Link>
                            </li>
                            <li className='bg-button text-btnText px-5 py-2 ml-2 rounded-2xl shadow-lg hover:shadow-2xl'>
                                <Link to='/signup'>Sign Up</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>


        </div>
    );
};

export default Navbar;
