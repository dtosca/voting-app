import React, { useState, useEffect } from "react";

const UserHeader = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("/check_session")
      .then((res) => res.json())
      .then((data) => {
        if (data.logged_in) {
          setCurrentUser(data.user);
        }
      });
  }, []);

  if (!currentUser) return null;

  return (
    <div className="alert alert-light text-end">
      signed in as <strong>{currentUser.email}</strong>
    </div>
  );
};

export default UserHeader;
