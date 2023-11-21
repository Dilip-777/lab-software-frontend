import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'



export default function TableMenu({ options, id }: { options: {label: string, onClick: (id?: number) => void}[], id: number }) {
  return (
    <div className="z-10 my-auto">
      <Menu as="div" className="inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-full hover:bg-gray-300 px-2 py-2 text-sm font-medium   focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
</svg>

          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-20 mt-2 w-fit origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="px-1 py-1 ">
             {
                options.map((option) => (
                     <Menu.Item >
               
                  <button
                  onClick={() => option.onClick(id)}
                    className="text-gray-900 hover:bg-[#1e88e5] hover:text-white
                     group flex w-full items-center rounded-md px-5 py-2 text-sm"
                  >
                    {option.label}
                  </button>
             
              </Menu.Item>
                ))
             }
             
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

