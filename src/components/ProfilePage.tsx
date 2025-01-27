import { useAuth0 } from '@auth0/auth0-react';

const ProfilePage = () => {
  const { user } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-6">
            <img 
              src={user?.picture} 
              alt={user?.name} 
              className="w-32 h-32 rounded-full border-4 border-blue-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
              <p className="text-lg text-gray-600 mt-2">{user?.email}</p>
              <div className="mt-4">
                <p className="text-gray-500">
                  <span className="font-semibold">Email verified:</span> 
                  {user?.email_verified ? ' Yes' : ' No'}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Last updated:</span> 
                  {new Date(user?.updated_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;