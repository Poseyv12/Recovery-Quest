import { getTeamLeaderboardData, getUserTeam } from '../actions'

export default async function LeaderboardPage() {
  const leaderboardData = await getTeamLeaderboardData()
  const userTeam = await getUserTeam()
  const userTeamId = userTeam?.id || null
  
  // Pre-calculate percentages and values server-side to avoid hydration errors
  const totalXpSum = leaderboardData.reduce((total, team) => total + team.xp, 0)
  const leaderXp = leaderboardData[0]?.xp || 1
  
  // Prepare stable data for each team
  const teamsWithPercentages = leaderboardData.map(entry => {
    const percentOfLeader = Math.floor((entry.xp / leaderXp) * 100)
    return {
      ...entry,
      percentOfLeader,
      percentWidth: `${percentOfLeader}%`
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Leaderboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Top performing teams in Recovery Quest. Join forces and climb the ranks!
          </p>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">{leaderboardData.length}</div>
            <div className="text-gray-500 text-sm">Active Teams</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {totalXpSum.toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm">Total XP Earned</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {leaderXp.toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm">Leading Team XP</div>
          </div>
        </div>
        
        {/* Main Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="grid grid-cols-12 gap-4 font-medium text-sm uppercase tracking-wider">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-6">Team</div>
              <div className="col-span-4 text-center">Experience Points</div>
            </div>
          </div>
          
          {/* Team List */}
          <div className="divide-y divide-gray-100">
            {teamsWithPercentages.map((entry, index) => (
              <div 
                key={entry.id} 
                className={`grid grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50 transition-colors duration-150 ease-in-out 
                  ${userTeamId && entry.id === userTeamId ? 'bg-blue-50 relative' : ''}
                  ${index === 0 ? 'bg-yellow-50' : index === 1 ? 'bg-gray-50' : index === 2 ? 'bg-amber-50' : ''}
                `}
              >
                {/* Position indicator for user's team */}
                {userTeamId && entry.id === userTeamId && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                )}
                
                {/* Rank */}
                <div className="col-span-2 flex justify-center items-center">
                  {index < 3 ? (
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md
                      ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 ring-2 ring-yellow-200' : 
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 ring-2 ring-gray-200' : 
                        'bg-gradient-to-br from-amber-500 to-amber-700 ring-2 ring-amber-200'}
                    `}>
                      {index + 1}
                    </div>
                  ) : (
                    <span className="text-gray-700 font-semibold text-lg">#{entry.rank}</span>
                  )}
                </div>
                
                {/* Team Info */}
                <div className="col-span-6 flex items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className={`font-bold text-lg ${userTeamId && entry.id === userTeamId ? 'text-blue-700' : 'text-gray-800'}`}>
                        {entry.name}
                      </span>
                      {userTeamId && entry.id === userTeamId && (
                        <span className="ml-3 text-xs bg-blue-500 text-white px-3 py-1 rounded-sm">
                          Your Team
                        </span>
                      )}
                      {index === 0 && (
                        <span className="ml-3 text-xs bg-yellow-500 text-white px-3 py-1 rounded-sm">
                          Leader
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* XP Points with progress bar */}
                <div className="col-span-4">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-extrabold ${userTeamId && entry.id === userTeamId ? 'text-blue-600' : 'text-indigo-600'}`}>
                        {entry.xp.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {entry.percentOfLeader}% of leader
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${userTeamId && entry.id === userTeamId ? 'bg-blue-500' : 'bg-indigo-500'}`}
                        style={{ width: entry.percentWidth }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm max-w-2xl mx-auto mb-4">
            Rankings updated daily. Keep pushing to climb the leaderboard!
          </p>
          <a 
            href="/dashboard" 
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
} 