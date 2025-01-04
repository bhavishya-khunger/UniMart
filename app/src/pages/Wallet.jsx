import React, { useContext, useEffect, useState } from 'react';
import BottomNav from '../components/General/BottomNav';
import { BsCopy, BsShare, BsWallet2 } from 'react-icons/bs';
import Transaction from '../components/Wallet/Transaction';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import ErrorPop from '../components/General/ErrorPop';

const Wallet = () => {
    const { user, setUser } = useContext(UserDataContext);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState(null);
    const [transactionType, setTransactionType] = useState("Test Points");
    const [txnUserId, setTxnUserId] = useState("");
    const [password, setPassword] = useState("");

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referalCode).then(() => {
            alert(`Referral code (${referalCode}) copied to clipboard!`);
        }).catch(err => {
            // console.error('Failed to copy: ', err);


        });
    };
    const handleShare = () => {
        const message = `🌟 Welcome to UniMart! 🎉
        
UniMart is your ultimate platform to get your orders delivered at your hostel door! Whether you're looking for print-on-demand, food pre-order to avoid queues are delivery in exchange of some coins, it is for you. It’s a one-stop shop for everything you need on campus. Join today and explore great deals! 🚀

Use my referral code *${referalCode}* to get exclusive discounts! 🎁 Don't miss out on this opportunity to save while shopping at UniMart!

Join now ➡️ https://w416mzq9-5173.inc1.devtunnels.ms/register?referal=${referalCode} 🌍

#UniMart #CampusShopping #ReferralCode`;
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

        // Open WhatsApp with the pre-filled message
        window.open(whatsappUrl, "_blank");
    };
    const referalCode = user?.referalCode; // This should be fetched from the backend 

    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const handleTransfer = async (e) => {
        e.preventDefault();
        setError("");

        console.log("txnUserId : ", txnUserId);
        console.log("amount : ", amount);
        console.log("transactionType : ", transactionType);
        console.log("password : ", password);

        try {
            const response = await axios.post(`${import.meta.env.VITE_USER_BASE_URL}/transfer-points`, {
                userSID: txnUserId,
                adminId: user?._id,
                amount: amount,
                title: transactionType,
                password: password,
            });
            console.log(response);
        } catch (error) {
            setError(error?.response?.data?.message || "Something went Wrong.");
            console.error("Error transferring coins:", error);
        }
    }

    useEffect(() => {
        try {
            axios.get(`${import.meta.env.VITE_USER_BASE_URL}/transactions/${user?._id}`).then((res) => {
                setTransactions(res.data.transactions);
            });
        } catch (error) {
            // console.error(error);


        }
    }, []);

    return (
        <>
            <div className="px-3 py-4 w-screen h-full select-none bg-white">
                <div className='bg-[url("https://static.vecteezy.com/system/resources/thumbnails/011/731/472/small/orange-abstract-background-with-geometric-shapes-concept-free-vector.jpg")] bg-cover h-fit rounded-3xl py-4 px-4'>
                    <div className="flex justify-between">
                        <h1 className="text-white font-semibold text-2xl">UniPoints</h1>
                        <button onClick={(e) => {
                            e.preventDefault();
                            window.location.href = 'https://forms.gle/XLwBBZ4aGMaQxNKL9';
                        }} className="text-white border px-2 rounded-full active:scale-95">+ Add</button>
                    </div>
                    <div className="mt-3 flex gap-2 items-center">
                        <BsWallet2 size={30} color="#fde047" />
                        <h1 className="text-4xl text-yellow-300 font-semibold">{user?.coins}pts</h1>
                    </div>
                    <div className="text-red-50 pt-4 pb-2 border-t border-dashed border-red-50 mt-5 flex flex-col">
                        <span>{user?.name}</span>
                        <span className="text-xs">{user?.role}</span>
                        <span className="text-xs">{user?.email}</span>
                    </div>
                </div>
                {user?.role === 'Admin' && (
                    <div className="mt-5 border border-gray-200 shadow-lg rounded-xl bg-white h-fit w-full px-3 py-4 flex flex-col items-center">
                        <h1 className='text-xl font-semibold'>Transfer Coins</h1>
                        <input value={txnUserId} onChange={(e) => setTxnUserId(e.target.value)} type="text" placeholder="Enter User SID" className="border outline-none border-gray-200 rounded-xl w-full px-2 py-1 mt-2" />
                        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Enter Amount" className="border outline-none border-gray-200 rounded-xl w-full px-2 py-1 mt-2" />
                        <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} className="border outline-none border-gray-200 rounded-xl w-full px-2 py-1 mt-2" name="txntype" id="txntype">
                            <option className='text-sm' value="Admin Transfer">Admin Transfer</option>
                            <option className='text-sm' value="Test Points">Test Points</option>
                            <option className='text-sm' value="Refund">Refund</option>
                        </select>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Confirm Password" className="border outline-none border-gray-200 rounded-xl w-full px-2 py-1 mt-2" />
                        <button onClick={handleTransfer} className="mt-2 flex justify-center gap-3 self-center py-2 w-full rounded-xl items-center text-white bg-[#FF4539] active:scale-95">
                            {/* #FF4539 - use this when u change */}
                            <BsWallet2 />Transfer Coins
                        </button>
                        {error && <ErrorPop text={error} />}
                    </div>
                )}
                {user?.role === 'Student' && (
                    <div className="mt-5 border border-gray-200 shadow-lg rounded-xl bg-white h-fit w-full px-3 py-4 flex flex-col items-center">
                        <p>Your Unique referal code is</p>
                        <p className='text-xl font-mono'>{referalCode}</p>
                        <p className='text-center text-sm italic'>Share the code with your friends and earn 30 points!</p>
                        <button onClick={handleShare} className="mt-2 flex justify-center gap-3 self-center py-2 w-full rounded-xl items-center text-white bg-[#FF4539] active:scale-95">
                            {/* #FF4539 - use this when u change */}
                            <BsShare />Share Invite Link
                        </button>
                    </div>
                )}
                <p className="mt-3 font-semibold text-lg">Recent Transactions</p>
                <div className='bg-white'>
                    {user?.transactionHistory?.length === 0 && <p className="text-center mt-4 text-gray-400">No transactions yet!</p>}
                    {sortedTransactions?.map((transaction, index) => (
                        <Transaction key={index} title={transaction?.title} date={transaction?.createdAt} value={transaction?.coinsEarned - transaction?.coinsSpent} />
                    ))}
                </div>
                <div className="h-20"></div>
                <BottomNav />
            </div>
        </>
    );
};

export default Wallet;
