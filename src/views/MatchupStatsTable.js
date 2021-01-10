
const MatchupStatsTable = (prop) => {
    const matchupStats = prop.stats;
    if (matchupStats != null) {
        return (
            <table>
                <tbody>
                    <tr>
                        <th>Team</th>
                        {
                            matchupStats.categories.map(
                                categoryHeader => <th>{categoryHeader}</th>
                            )
                        }
                    </tr>
                    <tr>
                        <td>{matchupStats.teamName1}</td>
                        {
                            matchupStats.teamStats1.map(
                                teamStats1 => <td>{teamStats1.toFixed(1)}</td>
                            )
                        }
                    </tr>
                    <tr>
                        <td>{matchupStats.teamName2}</td>
                        {
                            matchupStats.teamStats2.map(
                                teamStats2 => <td>{teamStats2.toFixed(1)}</td>
                            )
                        }
                    </tr>
                </tbody>
            </table>
        )
    } else {
        return (
            <table></table>
        )
    }
}

export default MatchupStatsTable;
