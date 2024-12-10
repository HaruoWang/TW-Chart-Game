import { useState } from "react";
import { ConnectButton, TransactionButton, useActiveAccount, useActiveWallet, useDisconnect, useReadContract } from "thirdweb/react";
import { client } from "../client";
import { shortenAddress } from "thirdweb/utils";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { claimTo, getBalance } from "thirdweb/extensions/erc20";

interface ClaimProps {
  gameResult: boolean;
  showModal: boolean;
  setShowModal: (claimed: boolean) => void;
}

export default function Claim({ gameResult, showModal, setShowModal }: ClaimProps) {
    const account = useActiveAccount();
    const {disconnect} = useDisconnect();
    const wallet = useActiveWallet();

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: "0xdaf72363355154b54fD0dC73cce97364D6790314"
    });

    const [prizeClaimed, setPrizeClaimed] = useState<boolean>(false);

    const claimPrize = () => {
        setShowModal(true);
    };

    const { data: tokenbalance } = useReadContract(
        getBalance,
        {
            contract: contract,
            address: account?.address!
        }
    )

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            width: '100vw',
            backgroundColor: '#f0f0f0',
            color: '#333',
        }}>
            <div style={{
                padding: '2rem',
                width: '296px',
                maxWidth: '98%',
                height: '200px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'relative'
            }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
                    {gameResult ? 'You Won!' : 'TW Chart Game'}
                </h1>
                {!account ? (
                    <ConnectButton
                        client={client}
                        accountAbstraction={{
                            chain: sepolia,
                            sponsorGas: true
                        }}
                    />
                ) : (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                height: 'auto',
                                width: '100%',
                                gap: '0.5rem',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                border: '1px solid #f0f0f0',
                                padding: '0.5rem',
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        fontSize: '0.5rem',
                                        marginBottom: '-10px',
                                        marginTop: '-10px'
                                    }}
                                >{shortenAddress(account.address)}</p> 
                                <p style={{
                                        fontSize: '0.75rem',
                                        marginBottom: '-10px'
                                    }}
                                >Balance: {tokenbalance?.displayValue}</p>
                            </div>
                            <button
                                onClick={() => disconnect(wallet!)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem'
                                }}
                            >Logout</button>
                        </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }}>
                                    {!gameResult && (
                                        <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href='/';
                                            }}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#ffc107',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >Replay</button>
                                    )}
                                    {gameResult && prizeClaimed && (
                                        <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href='/';
                                            }}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#ffc107',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >Replay</button>
                                    )}
                                    {gameResult && !prizeClaimed && (
                                        <button
                                            onClick={claimPrize}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#ffc107',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >Claim Prize</button>
                                    )}
                                    {showModal && (
                                        <div style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{
                                                background: 'white',
                                                padding: '2rem',
                                                borderRadius: '8px',
                                                maxWidth: '300px',
                                                textAlign: 'center'
                                            }}>
                                                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Claim 1 Token!</h2>
                                                <p style={{ marginBottom: '1rem' }}>You can claim 1 token to your wallet.</p>

                                                <TransactionButton
                                                    transaction={() => claimTo({
                                                        contract: contract,
                                                        to: account.address,
                                                        quantity: "1"
                                                    })}
                                                    onTransactionConfirmed={() => {
                                                        alert('Prize claimed!')
                                                        setShowModal(false)
                                                        setPrizeClaimed(true)
                                                    }}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >Claim Prize</TransactionButton>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                    </>
                )}
            </div>
        </div>
    )
}