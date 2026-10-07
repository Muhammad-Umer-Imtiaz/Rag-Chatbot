import { Show, SignInButton, SignUpButton, useClerk, UserButton } from '@clerk/nextjs'
import React from 'react'

const Navbar = () => {

    return (
        <header className="flex justify-between items-center p-4 gap-4 h-16">
            <div>Logo</div>
            <div className="space-x-5.5">
                <Show when="signed-out">
                    <SignInButton />
                    <SignUpButton>
                        <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </Show>
                <Show when="signed-in">
                    <UserButton />
                </Show>
            </div>
        </header>
    )
}

export default Navbar