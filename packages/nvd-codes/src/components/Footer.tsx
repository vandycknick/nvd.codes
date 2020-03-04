import React from "react"
import styled from "styled-components"

const FooterWrapper = styled.footer.attrs({ className: "footer" })`
  padding: 1rem 1.5rem;
`

const Footer: React.FC = () => (
  <FooterWrapper>
    <div className="container">
      <div className="columns is-variable is-8 is-marginless">
        <div className="column is-4 is-size-7 content">
          <h6>Copyright 2020</h6>
          <p>
            This work is licensed under a
            <a href="https://creativecommons.org/licenses/by/4.0/">
              &nbsp; Creative Commons Attribution 4.0 International License
            </a>
            . In other words, share generously but provide attribution.
          </p>
        </div>
        <div className="column is-4 is-size-7 content">
          <h6>Disclaimer</h6>
          <p>
            Opinions expressed here are my own and not necessarily those of
            people I work with, friends, family, etc. Unless I&#39;m quoting
            someone, they&#39;re just my own rants and views.
          </p>
        </div>
        <div className="column is-4 is-size-7 content">
          <h6>Technologies</h6>
          <p>
            This website is a serverless web application fully hosted on Azure.
            I&#39;m using Azure Functions to host front and backend. Have a look
            at the
            <a href="https://github.com/nickvdyck/nvd.codes"> source code </a>
            if you want more information.
          </p>
        </div>
      </div>
      <p className="content has-text-centered">
        <strong>nvd.codes</strong> was handcrafted with ❤️ by
        <a className="is-block" href="https://nvd.codes">
          Nick Van Dyck
        </a>
      </p>
    </div>
  </FooterWrapper>
)

export default Footer
