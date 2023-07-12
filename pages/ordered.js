import React from 'react';
import ProtectedPageRoute from '@/utils/protect-route';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext, useRef } from 'react';
import { DataContext } from '@/store/globalstate';
import Link from 'next/link';
import Head from 'next/head';
import { Success, Bullet } from '@/components/Icon';
import Confetti from 'react-confetti';
import { updateUserData } from '@/utils/controller/auth';

const payment = ({ user }) => {
  const router = useRouter();
  const { phoneNumber, orderID } = router.query;
  const { dispatch, state } = useContext(DataContext);

  // Subscribers state and logic
  const confettiContainerRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    if (confettiContainerRef.current) {
      const { width, height } =
        confettiContainerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    }
  }, []);
  useEffect(() => {
    let timeout;
    if (showConfetti) {
      timeout = setTimeout(() => setShowConfetti(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [showConfetti]);
  return (
    <>
      <Head>
        <title>Payment - Pasha</title>
      </Head>

      <section className="py-32 animate__animated animate__fadeIn animate__fast" ref={confettiContainerRef}>
        <div
          className="hidden md:block"
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
        >
          <Confetti
            width={containerSize.width}
            height={containerSize.height}
            gravity={0.05}
            numberOfPieces={300}
          />
        </div>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto mb-6 inline-block">
              <Success />
            </span>
            <span className="mb-1 block text-sm font-bold text-indigo-500">
              SUCCESS
            </span>
            <h3 className="mb-5 text-3xl text-gray-700 ">
              Your order has been placed
            </h3>
            <p className="mb-12 text-lg">
              You will recieve all updates regarding orders on your given
              Whatsapp number.
              <br />
              Thank you for ordering from
              <span className="font-bold"> Are Baba</span>
            </p>
            <div className="flex flex-col gap-5 md:flex-row">
              <Link
                className="xs:w-60 bg-blueGray-900 group relative inline-block h-12 w-full rounded-md"
                href="/collections"
              >
                <div className="absolute top-0 left-0 h-full w-full -translate-y-1 -translate-x-1 transform transition duration-300 group-hover:translate-y-0 group-hover:translate-x-0">
                  <div className="button-transition flex w-full items-center justify-start text-xl ">
                    <span className="h-4 w-4">
                      <Bullet />
                    </span>
                    Go to collections
                  </div>
                </div>
              </Link>
              <Link
                className="xs:w-60 bg-blueGray-900 group relative inline-block h-12 w-full rounded-md"
                href="/account/overview"
              >
                <div className="absolute top-0 left-0 h-full w-full -translate-y-1 -translate-x-1 transform transition duration-300 group-hover:translate-y-0 group-hover:translate-x-0">
                  <div className="flex h-full w-full items-center justify-center rounded-full border border-black bg-black hover:shadow-lg">
                    <span className="text-white">View Orders</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default payment;

export const getServerSideProps = async (context) =>
  ProtectedPageRoute(context, null, null);
