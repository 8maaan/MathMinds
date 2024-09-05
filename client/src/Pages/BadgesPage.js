import React, { useEffect, useState } from 'react';
import '../PagesCSS/BadgesPage.css';
import ReusableChoices from '../ReusableComponents/ReusableChoices';
import { getBadgesForUser } from '../API-Services/UserAPI'; // Adjust the path as needed
import { UserAuth } from '../Context-and-routes/AuthContext';

const BadgesPage = () => {
    const { user } = UserAuth();
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBadges = async () => {
            if (user) {
                const result = await getBadgesForUser(user.uid);
                if (result.success) {
                    setBadges(Object.entries(result.data)); // Convert object to array of entries
                    console.log("User Badges Data:", result.data);
                } else {
                    console.error("Failed to fetch badges:", result.message);
                }
                setLoading(false);
            }
        };
        fetchBadges();
    }, [user]);

    return (
        <div className="Profilepage">
            <div className='badges-wrapper'>
                <div className='badges-content-container'>
                    <div className='badgesinfo-left-side'>
                        <ReusableChoices />
                    </div>
                    <div className='badgesinfo-right-side'>
                        <div className='badges-container'>
                            <div className='badges-title'>Badges</div>
                            {loading ? (
                                <div className="loading">Loading...</div>
                            ) : (
                                <div className='userbadges-container'>
                                    <div className='userinfo-badges-container'>
                                        {badges.length === 0 ? (
                                            <p>No badges earned yet.</p>
                                        ) : (
                                            badges.map(([title, imageUrl]) => (
                                                <div key={title} className="badge">
                                                    <img src={imageUrl} alt={title} className="badge-image" />
                                                    <div className="badge-title">{title}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BadgesPage;
