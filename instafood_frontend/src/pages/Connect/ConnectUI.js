import DisplayArray from '../../functions/DisplayArray';
import DisplayUserForConnect from '../../functions/DisplayUserForConnect';

import useConnectLogic from './useConnectLogic';

function ConnectUI() {

    const {
        loadingForSubscriptions,
        input,
        setInput,
        listOfPossibleMatches,
        userOwnID,
        following,
        followRequestsSent,
    } = useConnectLogic();

    return (
        <div>
            <h2>Connect</h2>

            {loadingForSubscriptions ?
                <>
                    <p>Loading...</p>
                </>
                :
                <>
                    <label>Search for a user by his/her userID</label>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <DisplayArray array={listOfPossibleMatches} displayObjectFunc={c =>
                        <DisplayUserForConnect
                            otherUserID={c}
                            userOwnID={userOwnID}
                            following={following}
                            followRequestsSent={followRequestsSent}
                        />}
                    />
                </>
            }
        </div>
    );
}

export default ConnectUI;