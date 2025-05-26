import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Mail, UserPlus, Filter, Download } from 'lucide-react';

const UserManagement = () => {
  const [selectedTab, setSelectedTab] = useState('team');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const teamMembers = [
    {
      id: 1,
      name: 'Ashok Kumar',
      email: 'ashok@gmail.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 hours ago',
      avatar: 'https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/d565/9814/410c0e68cc5a1fddaf59dbaa4c8f4c01?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NJuUfBNqkkRBKsQRXkDw1otRahyF1W1KZOWcV1UdeBMVjDhBiES3oKt0AZSYa2AAwpyIudBUZ-c9x2S5ZLPjcgNxaWxaxFQZTMZ6f2kBSWdlwnWPTWHAYMQKpMU4PBXC75uy7rHrEOm3CfB2xTBTkTi8eIlDdFppLHHuh2rkR14CWS~2IRSOqCajDIYjKVKbJFCVDqFxG2YNFWgDQ84Mf8kE5ZffEUfC4GzeKHLJA~gn1mhopFAZ0jERz-HgmhkFZfZzbV-fiV1-AWtGL2l81G-w3TrFgxMe-Nof5KI6nECLT3F8RjxudsTLj3BHXBUVXS4C87iUdVzHTZha8kmsOA__'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'Editor',
      status: 'Active',
      lastActive: '1 day ago',
      avatar: 'https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/739b/c72e/00ccdfac86c98f764c0d40b9082c0948?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eVvY0kExVSk8VGAneULrqM2Pco4VJ7Mw6QwHRH9C2kFQJJ21zDnKl4S6a-WCgoEwGvLvtgLX3E1oXtEKZCtwV~QCZ3pJGZrULGwb-lFt50Vkz9GUkNWsO62AW-QJVvlMuyxEI83ze4I4AxRWtbP1KXpAoRanxyPfp1mIw6nW6HL~KYSVpIxOvBfCtsXhUdoYEuX23P2~2Is6e90aFNdD9hR5Nca-sXWaMFSqWRYx~SKcthrPBsV8l49eeiht-7BTEVIgpxNd2hJ75qJpaam6s7tRn9ADVHi7Fm5v1nvee-p9VJagdp-3DKc1-ADYXQm085srbBYWhiUY6mMb2HGYRg__'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael@example.com',
      role: 'Viewer',
      status: 'Invited',
      lastActive: 'Never',
      avatar: 'https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/c0e2/933e/fdb99117f541ad547913c1e534b80558?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=hxdfPfRWgVLmSZbdR~Fln~pQLnVezGKu~Uyi6eF3leyQEGkUcRcBdh9ONfY0FgNP3qr74f65wKJUn3rUMbdnO4O30NfXtvZ9cegBkYL9oZeXIPzPNF0p1jl~z9DcG9CUPj2oLJDUwfyvAEI7c5mMrHS3IwNr~VdkW0HJ2Bhk0lAojau7jsmdDM83F4c0rey9TaATVs29AlCeEOXukGjsFeZogtNjjruPqmZ2okAUCNbXn8WHdgNHJnS5RAdy5-NPeWIauoqDFrqTSJ~VOB4s8O7xWpeR4iI~2c4mpaHGbcIHMSTgae9XlwryUOQz2xQygZok79y5koUxyAeVQ7rWMA__'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      role: 'Editor',
      status: 'Active',
      lastActive: '3 days ago',
      avatar: 'https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/b07f/e3e7/a2b9a3337e1ae0a7a8e1a6adfaf064d1?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=uKsaZGrJtyOv7YOn1vIVxTm8jskO49sg435s55nzFQEr-IF3xcczVBN~1wGFhYXi8~oCCGTNqwc9aVEDchXXM9EDQxG9dcYxXSpmvXuEz3pqNjIvYOpZCfMhYY8XR8WsYA3WtwORMjnYy~6As2EgRh24SUX9~0P34K2XLvJau2n~9GgXw01vFo~Sno6HQhHh8VPBpBP8ZggCLPvTROLzfSqaIvy3q2zvMdoh4zWv7y4hQGXSzRdMr5yiTS4cqcqwZDu~NMuzEVaNRAUsemztuqV4wwoMrLX-N0oHqpwjJNh6F5lNA4N8OXtELq2lf~o13A5XJzKyZXppIDAAnnevKA__'
    },
  ];
  
  const pendingInvitations = [
    {
      id: 101,
      email: 'david@example.com',
      role: 'Editor',
      sentDate: '2023-07-10',
      status: 'Pending'
    },
    {
      id: 102,
      email: 'jennifer@example.com',
      role: 'Viewer',
      sentDate: '2023-07-12',
      status: 'Pending'
    }
  ];

  const handleUserAction = (action, user) => {
    setSelectedUser(user);
    if (action === 'edit') {
      // Open edit modal
      console.log('Edit user:', user);
    } else if (action === 'delete') {
      // Open delete confirmation
      console.log('Delete user:', user);
    }
  };

  const filteredTeamMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvitations = pendingInvitations.filter(invitation => 
    invitation.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const InviteUserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium">Invite Team Member</h3>
          <button 
            onClick={() => setShowInviteModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="flex">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] dark:bg-gray-700"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] dark:bg-gray-700">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] dark:bg-gray-700"
              rows="3"
              placeholder="Add a personal message to your invitation"
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-md"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite User</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex">
            <button
              className={`px-4 py-2 rounded-md ${selectedTab === 'team' ? 'bg-[#F97316]/10 text-[#F97316] font-medium' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setSelectedTab('team')}
            >
              Team Members ({teamMembers.length})
            </button>
            <button
              className={`px-4 py-2 rounded-md ${selectedTab === 'invitations' ? 'bg-[#F97316]/10 text-[#F97316] font-medium' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setSelectedTab('invitations')}
            >
              Pending Invitations ({pendingInvitations.length})
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] dark:bg-gray-700"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-4">
          {selectedTab === 'team' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTeamMembers.length > 0 ? (
                    filteredTeamMembers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'Admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            user.role === 'Editor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            user.status === 'Invited' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative inline-block text-left">
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden">
                              <div className="py-1" role="menu" aria-orientation="vertical">
                                <button
                                  onClick={() => handleUserAction('edit', user)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                  role="menuitem"
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </button>
                                <button
                                  onClick={() => handleUserAction('delete', user)}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                  role="menuitem"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No team members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sent Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredInvitations.length > 0 ? (
                    filteredInvitations.map((invitation) => (
                      <tr key={invitation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {invitation.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            invitation.role === 'Admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            invitation.role === 'Editor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {invitation.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {invitation.sentDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {invitation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#F97316] hover:text-[#F97316]/80 mr-3">
                            Resend
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No pending invitations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-[#FDE5E3] to-[#FFC9CA]/60 dark:from-[#FDE5E3]/20 dark:to-[#FFC9CA]/20 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 md:mr-6">
            <h3 className="text-xl font-semibold mb-2">Need more team members?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Upgrade to our Team plan to add unlimited team members and customize role permissions.
            </p>
            <button className="mt-4 bg-[#EC5347] hover:bg-[#D9382B] text-white font-medium py-2 px-6 rounded-md transition-colors">
              Upgrade Plan
            </button>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-[#EC5347]/20 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-[#EC5347]/30 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#EC5347] rounded-full flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showInviteModal && <InviteUserModal />}
    </div>
  );
};

export default UserManagement;
