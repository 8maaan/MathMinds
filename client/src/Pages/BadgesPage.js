import React, { useEffect, useState } from 'react';
import '../PagesCSS/BadgesPage.css';
import ReusableChoices from '../ReusableComponents/ReusableChoices';
import { getBadgesForUser, getUserProfileInfoFromDb } from '../API-Services/UserAPI'; // Adjust the path as needed
import { UserAuth } from '../Context-and-routes/AuthContext';
import { Alert } from '@mui/material';

// Inline styles for the shine effect
const shineStyle = {
    content: "''",
    position: 'absolute',
    top: 0,
    left: '-150px',
    width: '150px',
    height: '100%',
    background: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 70%)',
    transform: 'skewX(-20deg)',
    animation: 'shine 3s infinite linear', // Animation for the shine effect
    borderRadius: '10px', // Add border radius to match the badge container
  };

const badgeContainerStyle = {
    position: 'relative', // Contain the pseudo-element within this container
    width: '100px',
    height: '100px',
    overflow: 'hidden', // Prevent the shine effect from spilling out of the container
    borderRadius: '10px', 
};

const BadgesPage = () => {
  const { user } = UserAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(''); // State to hold user's full name

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Fetch user's profile info
        const profileResult = await getUserProfileInfoFromDb(user.uid);
        if (profileResult.success) {
          const { fname, lname } = profileResult.data;
          setUserName(`${fname} ${lname}`);
        } else {
          console.error('Failed to fetch user profile info:', profileResult.message);
        }

        // Fetch user's badges
        const badgesResult = await getBadgesForUser(user.uid);
        if (badgesResult.success) {
          setBadges(Object.entries(badgesResult.data)); // Convert object to array of entries
        } else {
          console.error('Failed to fetch badges:', badgesResult.message);
        }

        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

    return (
        <div className="badgesPage">
                {!user.emailVerified && (
                    <Alert
                        variant="filled"
                        severity="warning"
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        Please verify your email address to update your account information. An email has been sent to your inbox with verification instructions
                    </Alert>
                )}
                <div className='badgesPage-badges-wrapper'>
                    <div className='badgesPage-badges-content-container'>
                        <div className='badgesPage-badgesinfo-left-side'>
                            <ReusableChoices/>
                        </div>
                        <div className='badgesPage-badgesinfo-right-side'>
                            <div className='badgesPage-PI-container'>
                            <div className='badges-title'>{userName ? `${userName}'s Badges` : 'Badges'}</div>
                                <div className='badges-scrollable-container'>
                                {loading ? (
                                    <div className="loading">Loading...</div>
                                ) : (
                                    <div className='userbadges-container'>
                                        <div className={`userinfo-badges-container ${badges.length === 0 ? 'no-badges' : ''}`}>
                                            {badges.length === 0 ? (
                                                <div>
                                                    <p>No badges earned yet. Let's collect some by completing quizzes!✊</p>
                                                </div>
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
          
        </div>
    );
  return (
    <div className="badgesPage">
      <div className="badgesPage-badges-wrapper">
        <div className="badgesPage-badges-content-container">
          <div className="badgesPage-badgesinfo-left-side">
            <ReusableChoices />
          </div>
          <div className="badgesPage-badgesinfo-right-side">
            <div className="badgesPage-PI-container">
              <div className="badges-title">
                {userName ? `${userName}'s Badges` : 'Badges'}
              </div>
              <div className="badges-scrollable-container">
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : (
                  <div className="userbadges-container">
                    <div
                      className={`userinfo-badges-container ${
                        badges.length === 0 ? 'no-badges' : ''
                      }`}
                    >
                      {badges.length === 0 ? (
                        <div>
                          <p>
                            No badges earned yet. Let's collect some by
                            completing quizzes!✊
                          </p>
                        </div>
                      ) : (
                        badges.map(([title, imageUrl]) => (
                          <div key={title} className="badge">
                            <div style={badgeContainerStyle}>
                              <img
                                src={imageUrl}
                                alt={title}
                                className="badge-image"
                                style={{ width: '100%', height: '100%' }}
                              />
                              <div style={shineStyle}></div> {/* Shine effect */}
                            </div>
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
    </div>
  );
};

export default BadgesPage;
