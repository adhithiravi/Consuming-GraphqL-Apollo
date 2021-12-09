import * as React from "react";
import "./style-sessions.css";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";

/* ---> Define queries, mutations and fragments here */

const SPEAKER_ATTRIBUTES = gql`
  fragment SpeakerInfo on Speaker {
    id
    name
    bio
    sessions {
      id
      title
    }
    featured
  }
`;

const FEATURED_SPEAKER = gql`
  mutation markFeatured($speakerId: ID!, $featured: Boolean!) {
    markFeatured(speakerId: $speakerId, featured: $featured){
      id
      featured
    }
  }
`;

const SPEAKERS = gql`
  query speakers {
    speakers {
      ...SpeakerInfo
    }
  }
  ${ SPEAKER_ATTRIBUTES }
`;

const SPEAKER_BY_ID = gql`
  query speakerById($id: ID!) {
    speakerById(id: $id) {
        ...SpeakerInfo
      }
    }
    ${ SPEAKER_ATTRIBUTES }
`;

const SpeakerList = () => {

  /* ---> Replace hardcoded speaker values with data that you get back from GraphQL server here */
  const { loading, error, data } = useQuery(SPEAKERS);
  
  const [ markedFeatured ] = useMutation(FEATURED_SPEAKER);

  if(loading) return <p>Loading speakers...</p>
  if(error) return <p>Error loading speakers!</p> 

  return data.speakers.map(({ id, name, bio, sessions, featured }) =>
		<div
      key={id}
      className="col-xs-12 col-sm-6 col-md-6"
      style={{ padding: 5 }}
    >
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{'Speaker: '+ name}</h3>
        </div>
        <div className="panel-body">
          <h5>{'Bio: '+ bio }</h5>
        </div>
        <div className="panel-footer">
          <h4>Sessions</h4>
					{
						/* ---> Loop through speaker's sessions here */
            sessions.map((session) => (
              <span key={session.id} style={{ padding: 2 }}>
                <p>{session.title}</p>
              </span>
            ))
					}
          <span>	
            <button	
              type="button"	
              className="btn btn-default btn-lg"	
              onClick={ async () => {
                /* ---> Call useMutation's mutate function to mark speaker as featured */
                await markedFeatured({ variables: {
                  speakerId: id, featured: true
                }})
              }}	
              >	
                <i	
                  className={`fa ${featured ? "fa-star" : "fa-star-o"}`}	
                  aria-hidden="true"	
                  style={{	
                    color: featured ? "gold" : undefined,	
                  }}	
                ></i>{" "}	
                Featured Speaker	
            </button>	
          </span>
        </div>
      </div>
    </div>
	);
};

const SpeakerDetails = () => {

    /* ---> Replace hardcoded speaker values with data that you get back from GraphQL server here */
  const { speaker_id } = useParams();

  const { loading, error, data } = useQuery(SPEAKER_BY_ID, 
    {
      variables: { id: speaker_id }
    });

  if(loading) return <p>Loading speakers...</p>
  if(error) return <p>Error loading speakers!</p> 

  const speaker = data.speakerById;
  const { id, name, bio, sessions } = speaker;

  return (
    <div key={id} className="col-xs-12" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{name}</h3>
        </div>
        <div className="panel-body">
          <h5>{bio}</h5>
        </div>
        <div className="panel-footer">
          {sessions.map(({ id, title }) => (
            <span key={id} style={{ padding: 5 }}>
              "{title}"
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export function Speaker() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerDetails />
        </div>
      </div>
    </>
  );
}

export function Speakers() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerList />
        </div>
      </div>
    </>
  );
}
