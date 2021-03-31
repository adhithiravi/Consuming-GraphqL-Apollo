import { MockedProvider } from "@apollo/client/testing";
import { mount, shallow } from "enzyme";
import { Speakers, SPEAKERSQUERY } from "./Speakers";
import React from "react";
import { act } from "react-dom/test-utils";
import wait from "waait";

const mockWithData = {
  request: {
    query: SPEAKERSQUERY,
  },
  result: {
    data: {
      speakers: [
        {
          id: "1234",
          name: "Adhithi Ravichandran",
          bio: "Here is my bio",
          sessions: [
            {
              id: "1233",
              title: "GraphQL Testing",
            },
            {
              id: "2345",
              title: "GraphQL Big picture",
            },
          ],
          featured: false,
        },
      ],
    },
  },
};

const mockWithError = [
  {
    request: {
      query: SPEAKERSQUERY,
    },
    error: new Error("Network Error"),
  },
];

it("renders with loading", () => {
  let wrapper;
  act(() => {
    wrapper = mount(
      <MockedProvider addTypename={false} mocks={[mockWithData]}>
        <Speakers />
      </MockedProvider>
    );
  });

  expect(wrapper).toBeTruthy();
  expect(wrapper).toHaveText("Loading speakers...");
});

it("renders speaker data", async () => {
  let wrapper;
  await act(async () => {
    wrapper = mount(
      <MockedProvider addTypename={false} mocks={[mockWithData]}>
        <Speakers />
      </MockedProvider>
    );
  });

  await act(() => wait(0));
  wrapper.update();
  expect(wrapper).toBeTruthy();
  expect(wrapper.find(".panel-heading")).toHaveText(
    "Speaker: Adhithi Ravichandran"
  );
  expect(wrapper.find(".panel-body")).toHaveText("Bio: Here is my bio");
});

it("renders with error", async () => {
  let wrapper;
  await act(async () => {
    wrapper = mount(
      <MockedProvider addTypename={false} mocks={mockWithError}>
        <Speakers />
      </MockedProvider>
    );
  });

  await act(() => wait(0));
  expect(wrapper).toBeTruthy();
  expect(wrapper).toHaveText("Error loading speakers!");
});


