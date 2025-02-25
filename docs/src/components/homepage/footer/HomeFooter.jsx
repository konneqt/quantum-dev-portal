import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { Linkedin, Github } from '@styled-icons/boxicons-logos';

function Safety({ className }) {
  return (
    <div
      className={clsx(
        'flex max-w-[418px] flex-row overflow-clip rounded-2xl bg-white dark:bg-[#474747] sm:flex-col sm:pr-0 sm:pb-8 lg:flex-row lg:pr-16 lg:pb-0',
        className,
      )}
    >
      <div className="flex flex-1 place-items-center justify-center rounded-2xl bg-white px-4 py-6 font-jakarta font-bold text-gray-500 dark:bg-[#474747] dark:text-[#fff]">
        Your Security,
        <br />
        Our Priority.
      </div>
      <div className="flex flex-1 items-center justify-around px-6">
        <img src="/img/soc-compliant-1.png" alt="SOC Compliant" />
        <img src="/img/vector.png" alt="HIPAA Compliant" />
        <img
          style={{ width: '62px' }}
          src="/img/gdpr_docs.png"
          alt="GDPR compliant"
        />
      </div>
    </div>
  );
}

function Status({ className }) {
  const [status, setStatus] = useState({
    indicator: 'none',
    description: 'All Systems Operational',
  });

  useEffect(() => {
    if (typeof StatusPage !== 'undefined') {
      // eslint-disable-next-line no-undef
      var sp = new StatusPage.page({ page: 'wjlxrzb5h09l' });
      sp.status({
        success: function (data) {
          setStatus({
            indicator: data.status.indicator,
            description: data.status.description,
          });
        },
      });
    }
  }, []);

  return (
    <Link
      href="https://status.dyte.io"
      className={clsx(
        'flex items-center gap-2 rounded-lg border border-transparent p-1 px-2 font-jakarta font-semibold text-gray-500 transition-colors hover:border-gray-400 hover:bg-white hover:no-underline dark:hover:bg-[#474747]',
        className,
      )}
      target="_blank"
    >
      <div
        className={clsx(
          'h-4 w-4 rounded-full bg-[#2DB002]',
          status.indicator === 'none' ? 'bg-[#2DB002]' : 'bg-yellow-500',
        )}
      ></div>
      <div>{status.description}</div>
    </Link>
  );
}

function Links({ name, links, isAccordion }) {
  //To control accordion in footer
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (href) => {
    setActiveAccordion((prevAccordion) =>
      prevAccordion === href ? null : href,
    );
  };

  return (
    <div>
      <h3 className="font-jakarta text-base font-semibold uppercase text-gray-400 dark:text-[#fff]">
        {name}
      </h3>
      <div className="flex flex-col gap-3">
        {links.map(({ name, href, isAccordion, content }) => (
          <Link
            href={href}
            className="text-base text-gray-700 hover:text-primary hover:no-underline dark:text-[#f9f9f9]"
            onClick={() => (isAccordion ? toggleAccordion(href) : null)}
          >
            {name}
            {isAccordion && activeAccordion === href && (
              <ul style={{ paddingLeft: '1rem', listStyle: 'unset' }}>
                {content.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-base text-gray-700 hover:text-primary hover:no-underline dark:text-[#f9f9f9]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#F4F7FF] dark:bg-[#191919]">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col px-6 py-12">
        <hr className="my-12 !bg-gray-300 dark:!bg-[#999]" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <span className="text-inherit dark:text-[#999]">
              &copy; Copyright © ${new Date().getFullYear()} https://konneqt.io
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/konneqt/quantum-dev-portal"
              aria-label="Dyte's GitHub Organization"
            >
              <Github className="h-7 w-7 text-zinc-400 hover:text-primary" />
            </Link>
            <Link
              href="https://www.linkedin.com/company/konneqt-tech"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-7 w-7 text-zinc-400 hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
