--
-- PostgreSQL database dump
--

\restrict DWTgJ1qv7XNu9VHQdgffVzwdo9ger5qOy5FYBMvgAtZgNhdzD0X1bRpndjUSJeI

-- Dumped from database version 15.19
-- Dumped by pg_dump version 15.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_event_entity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.admin_event_entity (
    id character varying(36) NOT NULL,
    admin_event_time bigint,
    realm_id character varying(255),
    operation_type character varying(255),
    auth_realm_id character varying(255),
    auth_client_id character varying(255),
    auth_user_id character varying(255),
    ip_address character varying(255),
    resource_path character varying(2550),
    representation text,
    error character varying(255),
    resource_type character varying(64)
);


ALTER TABLE public.admin_event_entity OWNER TO admin;

--
-- Name: associated_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.associated_policy (
    policy_id character varying(36) NOT NULL,
    associated_policy_id character varying(36) NOT NULL
);


ALTER TABLE public.associated_policy OWNER TO admin;

--
-- Name: attachments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.attachments (
    id integer NOT NULL,
    partnership_id integer NOT NULL,
    file_name character varying(255) NOT NULL,
    file_url character varying(500) NOT NULL,
    file_type character varying(50),
    uploaded_at timestamp without time zone,
    stage_id integer,
    file_size integer,
    document_type character varying(50)
);


ALTER TABLE public.attachments OWNER TO admin;

--
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attachments_id_seq OWNER TO admin;

--
-- Name: attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.attachments_id_seq OWNED BY public.attachments.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id character varying(100) NOT NULL,
    action character varying(100) NOT NULL,
    entity_name character varying(100) NOT NULL,
    entity_id integer,
    ip_address character varying(45),
    "timestamp" timestamp without time zone
);


ALTER TABLE public.audit_logs OWNER TO admin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_logs_id_seq OWNER TO admin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: authentication_execution; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authentication_execution (
    id character varying(36) NOT NULL,
    alias character varying(255),
    authenticator character varying(36),
    realm_id character varying(36),
    flow_id character varying(36),
    requirement integer,
    priority integer,
    authenticator_flow boolean DEFAULT false NOT NULL,
    auth_flow_id character varying(36),
    auth_config character varying(36)
);


ALTER TABLE public.authentication_execution OWNER TO admin;

--
-- Name: authentication_flow; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authentication_flow (
    id character varying(36) NOT NULL,
    alias character varying(255),
    description character varying(255),
    realm_id character varying(36),
    provider_id character varying(36) DEFAULT 'basic-flow'::character varying NOT NULL,
    top_level boolean DEFAULT false NOT NULL,
    built_in boolean DEFAULT false NOT NULL
);


ALTER TABLE public.authentication_flow OWNER TO admin;

--
-- Name: authenticator_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authenticator_config (
    id character varying(36) NOT NULL,
    alias character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.authenticator_config OWNER TO admin;

--
-- Name: authenticator_config_entry; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authenticator_config_entry (
    authenticator_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.authenticator_config_entry OWNER TO admin;

--
-- Name: broker_link; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.broker_link (
    identity_provider character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL,
    broker_user_id character varying(255),
    broker_username character varying(255),
    token text,
    user_id character varying(255) NOT NULL
);


ALTER TABLE public.broker_link OWNER TO admin;

--
-- Name: catalog_import_jobs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.catalog_import_jobs (
    id character varying(36) NOT NULL,
    owner_id character varying(255) NOT NULL,
    catalog character varying(32) NOT NULL,
    payload character varying NOT NULL,
    result text,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.catalog_import_jobs OWNER TO admin;

--
-- Name: catalog_managers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.catalog_managers (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.catalog_managers OWNER TO admin;

--
-- Name: catalog_managers_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.catalog_managers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.catalog_managers_id_seq OWNER TO admin;

--
-- Name: catalog_managers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.catalog_managers_id_seq OWNED BY public.catalog_managers.id;


--
-- Name: client; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client (
    id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    full_scope_allowed boolean DEFAULT false NOT NULL,
    client_id character varying(255),
    not_before integer,
    public_client boolean DEFAULT false NOT NULL,
    secret character varying(255),
    base_url character varying(255),
    bearer_only boolean DEFAULT false NOT NULL,
    management_url character varying(255),
    surrogate_auth_required boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    protocol character varying(255),
    node_rereg_timeout integer DEFAULT 0,
    frontchannel_logout boolean DEFAULT false NOT NULL,
    consent_required boolean DEFAULT false NOT NULL,
    name character varying(255),
    service_accounts_enabled boolean DEFAULT false NOT NULL,
    client_authenticator_type character varying(255),
    root_url character varying(255),
    description character varying(255),
    registration_token character varying(255),
    standard_flow_enabled boolean DEFAULT true NOT NULL,
    implicit_flow_enabled boolean DEFAULT false NOT NULL,
    direct_access_grants_enabled boolean DEFAULT false NOT NULL,
    always_display_in_console boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client OWNER TO admin;

--
-- Name: client_attributes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_attributes (
    client_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.client_attributes OWNER TO admin;

--
-- Name: client_auth_flow_bindings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_auth_flow_bindings (
    client_id character varying(36) NOT NULL,
    flow_id character varying(36),
    binding_name character varying(255) NOT NULL
);


ALTER TABLE public.client_auth_flow_bindings OWNER TO admin;

--
-- Name: client_initial_access; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_initial_access (
    id character varying(36) NOT NULL,
    realm_id character varying(36) NOT NULL,
    "timestamp" integer,
    expiration integer,
    count integer,
    remaining_count integer
);


ALTER TABLE public.client_initial_access OWNER TO admin;

--
-- Name: client_node_registrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_node_registrations (
    client_id character varying(36) NOT NULL,
    value integer,
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_node_registrations OWNER TO admin;

--
-- Name: client_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope (
    id character varying(36) NOT NULL,
    name character varying(255),
    realm_id character varying(36),
    description character varying(255),
    protocol character varying(255)
);


ALTER TABLE public.client_scope OWNER TO admin;

--
-- Name: client_scope_attributes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope_attributes (
    scope_id character varying(36) NOT NULL,
    value character varying(2048),
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_scope_attributes OWNER TO admin;

--
-- Name: client_scope_client; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope_client (
    client_id character varying(255) NOT NULL,
    scope_id character varying(255) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client_scope_client OWNER TO admin;

--
-- Name: client_scope_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope_role_mapping (
    scope_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.client_scope_role_mapping OWNER TO admin;

--
-- Name: client_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session (
    id character varying(36) NOT NULL,
    client_id character varying(36),
    redirect_uri character varying(255),
    state character varying(255),
    "timestamp" integer,
    session_id character varying(36),
    auth_method character varying(255),
    realm_id character varying(255),
    auth_user_id character varying(36),
    current_action character varying(36)
);


ALTER TABLE public.client_session OWNER TO admin;

--
-- Name: client_session_auth_status; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_auth_status (
    authenticator character varying(36) NOT NULL,
    status integer,
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_auth_status OWNER TO admin;

--
-- Name: client_session_note; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_note (
    name character varying(255) NOT NULL,
    value character varying(255),
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_note OWNER TO admin;

--
-- Name: client_session_prot_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_prot_mapper (
    protocol_mapper_id character varying(36) NOT NULL,
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_prot_mapper OWNER TO admin;

--
-- Name: client_session_role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_role (
    role_id character varying(255) NOT NULL,
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_role OWNER TO admin;

--
-- Name: client_user_session_note; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_user_session_note (
    name character varying(255) NOT NULL,
    value character varying(2048),
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_user_session_note OWNER TO admin;

--
-- Name: component; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.component (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_id character varying(36),
    provider_id character varying(36),
    provider_type character varying(255),
    realm_id character varying(36),
    sub_type character varying(255)
);


ALTER TABLE public.component OWNER TO admin;

--
-- Name: component_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.component_config (
    id character varying(36) NOT NULL,
    component_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(4000)
);


ALTER TABLE public.component_config OWNER TO admin;

--
-- Name: composite_role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.composite_role (
    composite character varying(36) NOT NULL,
    child_role character varying(36) NOT NULL
);


ALTER TABLE public.composite_role OWNER TO admin;

--
-- Name: credential; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    user_id character varying(36),
    created_date bigint,
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


ALTER TABLE public.credential OWNER TO admin;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO admin;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO admin;

--
-- Name: default_client_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.default_client_scope (
    realm_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.default_client_scope OWNER TO admin;

--
-- Name: event_entity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.event_entity (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    details_json character varying(2550),
    error character varying(255),
    ip_address character varying(255),
    realm_id character varying(255),
    session_id character varying(255),
    event_time bigint,
    type character varying(255),
    user_id character varying(255)
);


ALTER TABLE public.event_entity OWNER TO admin;

--
-- Name: fed_user_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_attribute (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    value character varying(2024)
);


ALTER TABLE public.fed_user_attribute OWNER TO admin;

--
-- Name: fed_user_consent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.fed_user_consent OWNER TO admin;

--
-- Name: fed_user_consent_cl_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_consent_cl_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.fed_user_consent_cl_scope OWNER TO admin;

--
-- Name: fed_user_credential; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    created_date bigint,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


ALTER TABLE public.fed_user_credential OWNER TO admin;

--
-- Name: fed_user_group_membership; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_group_membership OWNER TO admin;

--
-- Name: fed_user_required_action; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_required_action (
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_required_action OWNER TO admin;

--
-- Name: fed_user_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_role_mapping (
    role_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_role_mapping OWNER TO admin;

--
-- Name: federated_identity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.federated_identity (
    identity_provider character varying(255) NOT NULL,
    realm_id character varying(36),
    federated_user_id character varying(255),
    federated_username character varying(255),
    token text,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_identity OWNER TO admin;

--
-- Name: federated_user; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.federated_user (
    id character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_user OWNER TO admin;

--
-- Name: group_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.group_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_attribute OWNER TO admin;

--
-- Name: group_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.group_role_mapping (
    role_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_role_mapping OWNER TO admin;

--
-- Name: identity_provider; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.identity_provider (
    internal_id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    provider_alias character varying(255),
    provider_id character varying(255),
    store_token boolean DEFAULT false NOT NULL,
    authenticate_by_default boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    add_token_role boolean DEFAULT true NOT NULL,
    trust_email boolean DEFAULT false NOT NULL,
    first_broker_login_flow_id character varying(36),
    post_broker_login_flow_id character varying(36),
    provider_display_name character varying(255),
    link_only boolean DEFAULT false NOT NULL
);


ALTER TABLE public.identity_provider OWNER TO admin;

--
-- Name: identity_provider_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.identity_provider_config (
    identity_provider_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.identity_provider_config OWNER TO admin;

--
-- Name: identity_provider_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.identity_provider_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    idp_alias character varying(255) NOT NULL,
    idp_mapper_name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.identity_provider_mapper OWNER TO admin;

--
-- Name: idp_mapper_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.idp_mapper_config (
    idp_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.idp_mapper_config OWNER TO admin;

--
-- Name: keycloak_group; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.keycloak_group (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_group character varying(36) NOT NULL,
    realm_id character varying(36)
);


ALTER TABLE public.keycloak_group OWNER TO admin;

--
-- Name: keycloak_role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.keycloak_role (
    id character varying(36) NOT NULL,
    client_realm_constraint character varying(255),
    client_role boolean DEFAULT false NOT NULL,
    description character varying(255),
    name character varying(255),
    realm_id character varying(255),
    client character varying(36),
    realm character varying(36)
);


ALTER TABLE public.keycloak_role OWNER TO admin;

--
-- Name: migration_model; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.migration_model (
    id character varying(36) NOT NULL,
    version character varying(36),
    update_time bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.migration_model OWNER TO admin;

--
-- Name: offline_client_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.offline_client_session (
    user_session_id character varying(36) NOT NULL,
    client_id character varying(255) NOT NULL,
    offline_flag character varying(4) NOT NULL,
    "timestamp" integer,
    data text,
    client_storage_provider character varying(36) DEFAULT 'local'::character varying NOT NULL,
    external_client_id character varying(255) DEFAULT 'local'::character varying NOT NULL
);


ALTER TABLE public.offline_client_session OWNER TO admin;

--
-- Name: offline_user_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.offline_user_session (
    user_session_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    created_on integer NOT NULL,
    offline_flag character varying(4) NOT NULL,
    data text,
    last_session_refresh integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.offline_user_session OWNER TO admin;

--
-- Name: partnership_comments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.partnership_comments (
    id integer NOT NULL,
    partnership_id integer NOT NULL,
    author_id character varying(100) NOT NULL,
    text text NOT NULL,
    created_at timestamp without time zone,
    stage_id integer
);


ALTER TABLE public.partnership_comments OWNER TO admin;

--
-- Name: partnership_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.partnership_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.partnership_comments_id_seq OWNER TO admin;

--
-- Name: partnership_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.partnership_comments_id_seq OWNED BY public.partnership_comments.id;


--
-- Name: partnership_requests; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.partnership_requests (
    id integer NOT NULL,
    requester character varying(255) NOT NULL,
    requester_name character varying(255) NOT NULL,
    university_id integer NOT NULL,
    program_id integer NOT NULL,
    status character varying(20) NOT NULL,
    partnership_id integer,
    decided_by character varying(255),
    reason text,
    created_at timestamp without time zone NOT NULL,
    decided_at timestamp without time zone
);


ALTER TABLE public.partnership_requests OWNER TO admin;

--
-- Name: partnership_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.partnership_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.partnership_requests_id_seq OWNER TO admin;

--
-- Name: partnership_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.partnership_requests_id_seq OWNED BY public.partnership_requests.id;


--
-- Name: partnership_state; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.partnership_state (
    partnership_id integer NOT NULL,
    data character varying NOT NULL
);


ALTER TABLE public.partnership_state OWNER TO admin;

--
-- Name: partnerships; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.partnerships (
    id integer NOT NULL,
    university_id integer NOT NULL,
    program_id integer NOT NULL,
    stage_id integer NOT NULL,
    manager_name character varying(255),
    contract_number character varying(100),
    is_license_signed boolean,
    license_term_years integer,
    comment text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    transfer_status character varying(100)
);


ALTER TABLE public.partnerships OWNER TO admin;

--
-- Name: partnerships_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.partnerships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.partnerships_id_seq OWNER TO admin;

--
-- Name: partnerships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.partnerships_id_seq OWNED BY public.partnerships.id;


--
-- Name: policy_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.policy_config (
    policy_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.policy_config OWNER TO admin;

--
-- Name: programs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.programs (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    direction character varying(100) NOT NULL,
    vendor character varying(100),
    software character varying(100),
    priority integer,
    is_active boolean
);


ALTER TABLE public.programs OWNER TO admin;

--
-- Name: programs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.programs_id_seq OWNER TO admin;

--
-- Name: programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;


--
-- Name: protocol_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.protocol_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    protocol character varying(255) NOT NULL,
    protocol_mapper_name character varying(255) NOT NULL,
    client_id character varying(36),
    client_scope_id character varying(36)
);


ALTER TABLE public.protocol_mapper OWNER TO admin;

--
-- Name: protocol_mapper_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.protocol_mapper_config (
    protocol_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.protocol_mapper_config OWNER TO admin;

--
-- Name: realm; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm (
    id character varying(36) NOT NULL,
    access_code_lifespan integer,
    user_action_lifespan integer,
    access_token_lifespan integer,
    account_theme character varying(255),
    admin_theme character varying(255),
    email_theme character varying(255),
    enabled boolean DEFAULT false NOT NULL,
    events_enabled boolean DEFAULT false NOT NULL,
    events_expiration bigint,
    login_theme character varying(255),
    name character varying(255),
    not_before integer,
    password_policy character varying(2550),
    registration_allowed boolean DEFAULT false NOT NULL,
    remember_me boolean DEFAULT false NOT NULL,
    reset_password_allowed boolean DEFAULT false NOT NULL,
    social boolean DEFAULT false NOT NULL,
    ssl_required character varying(255),
    sso_idle_timeout integer,
    sso_max_lifespan integer,
    update_profile_on_soc_login boolean DEFAULT false NOT NULL,
    verify_email boolean DEFAULT false NOT NULL,
    master_admin_client character varying(36),
    login_lifespan integer,
    internationalization_enabled boolean DEFAULT false NOT NULL,
    default_locale character varying(255),
    reg_email_as_username boolean DEFAULT false NOT NULL,
    admin_events_enabled boolean DEFAULT false NOT NULL,
    admin_events_details_enabled boolean DEFAULT false NOT NULL,
    edit_username_allowed boolean DEFAULT false NOT NULL,
    otp_policy_counter integer DEFAULT 0,
    otp_policy_window integer DEFAULT 1,
    otp_policy_period integer DEFAULT 30,
    otp_policy_digits integer DEFAULT 6,
    otp_policy_alg character varying(36) DEFAULT 'HmacSHA1'::character varying,
    otp_policy_type character varying(36) DEFAULT 'totp'::character varying,
    browser_flow character varying(36),
    registration_flow character varying(36),
    direct_grant_flow character varying(36),
    reset_credentials_flow character varying(36),
    client_auth_flow character varying(36),
    offline_session_idle_timeout integer DEFAULT 0,
    revoke_refresh_token boolean DEFAULT false NOT NULL,
    access_token_life_implicit integer DEFAULT 0,
    login_with_email_allowed boolean DEFAULT true NOT NULL,
    duplicate_emails_allowed boolean DEFAULT false NOT NULL,
    docker_auth_flow character varying(36),
    refresh_token_max_reuse integer DEFAULT 0,
    allow_user_managed_access boolean DEFAULT false NOT NULL,
    sso_max_lifespan_remember_me integer DEFAULT 0 NOT NULL,
    sso_idle_timeout_remember_me integer DEFAULT 0 NOT NULL,
    default_role character varying(255)
);


ALTER TABLE public.realm OWNER TO admin;

--
-- Name: realm_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_attribute (
    name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    value text
);


ALTER TABLE public.realm_attribute OWNER TO admin;

--
-- Name: realm_default_groups; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_default_groups (
    realm_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_default_groups OWNER TO admin;

--
-- Name: realm_enabled_event_types; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_enabled_event_types (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_enabled_event_types OWNER TO admin;

--
-- Name: realm_events_listeners; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_events_listeners (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_events_listeners OWNER TO admin;

--
-- Name: realm_localizations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_localizations (
    realm_id character varying(255) NOT NULL,
    locale character varying(255) NOT NULL,
    texts text NOT NULL
);


ALTER TABLE public.realm_localizations OWNER TO admin;

--
-- Name: realm_required_credential; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_required_credential (
    type character varying(255) NOT NULL,
    form_label character varying(255),
    input boolean DEFAULT false NOT NULL,
    secret boolean DEFAULT false NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_required_credential OWNER TO admin;

--
-- Name: realm_smtp_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_smtp_config (
    realm_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.realm_smtp_config OWNER TO admin;

--
-- Name: realm_supported_locales; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_supported_locales (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_supported_locales OWNER TO admin;

--
-- Name: redirect_uris; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.redirect_uris (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.redirect_uris OWNER TO admin;

--
-- Name: required_action_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.required_action_config (
    required_action_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.required_action_config OWNER TO admin;

--
-- Name: required_action_provider; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.required_action_provider (
    id character varying(36) NOT NULL,
    alias character varying(255),
    name character varying(255),
    realm_id character varying(36),
    enabled boolean DEFAULT false NOT NULL,
    default_action boolean DEFAULT false NOT NULL,
    provider_id character varying(255),
    priority integer
);


ALTER TABLE public.required_action_provider OWNER TO admin;

--
-- Name: resource_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    resource_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_attribute OWNER TO admin;

--
-- Name: resource_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_policy (
    resource_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_policy OWNER TO admin;

--
-- Name: resource_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_scope (
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_scope OWNER TO admin;

--
-- Name: resource_server; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server (
    id character varying(36) NOT NULL,
    allow_rs_remote_mgmt boolean DEFAULT false NOT NULL,
    policy_enforce_mode smallint NOT NULL,
    decision_strategy smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.resource_server OWNER TO admin;

--
-- Name: resource_server_perm_ticket; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_perm_ticket (
    id character varying(36) NOT NULL,
    owner character varying(255) NOT NULL,
    requester character varying(255) NOT NULL,
    created_timestamp bigint NOT NULL,
    granted_timestamp bigint,
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36),
    resource_server_id character varying(36) NOT NULL,
    policy_id character varying(36)
);


ALTER TABLE public.resource_server_perm_ticket OWNER TO admin;

--
-- Name: resource_server_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_policy (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    type character varying(255) NOT NULL,
    decision_strategy smallint,
    logic smallint,
    resource_server_id character varying(36) NOT NULL,
    owner character varying(255)
);


ALTER TABLE public.resource_server_policy OWNER TO admin;

--
-- Name: resource_server_resource; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_resource (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255),
    icon_uri character varying(255),
    owner character varying(255) NOT NULL,
    resource_server_id character varying(36) NOT NULL,
    owner_managed_access boolean DEFAULT false NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_resource OWNER TO admin;

--
-- Name: resource_server_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_scope (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    icon_uri character varying(255),
    resource_server_id character varying(36) NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_scope OWNER TO admin;

--
-- Name: resource_uris; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_uris (
    resource_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.resource_uris OWNER TO admin;

--
-- Name: role_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.role_attribute (
    id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255)
);


ALTER TABLE public.role_attribute OWNER TO admin;

--
-- Name: scope_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.scope_mapping (
    client_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_mapping OWNER TO admin;

--
-- Name: scope_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.scope_policy (
    scope_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_policy OWNER TO admin;

--
-- Name: students; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.students (
    id integer NOT NULL,
    partnership_id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    created_at timestamp without time zone
);


ALTER TABLE public.students OWNER TO admin;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.students_id_seq OWNER TO admin;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: universities; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.universities (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    region character varying(100),
    contact_name character varying(255),
    contact_email character varying(255),
    contact_phone character varying(255),
    created_at timestamp without time zone
);


ALTER TABLE public.universities OWNER TO admin;

--
-- Name: universities_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.universities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.universities_id_seq OWNER TO admin;

--
-- Name: universities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.universities_id_seq OWNED BY public.universities.id;


--
-- Name: user_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_attribute (
    name character varying(255) NOT NULL,
    value character varying(255),
    user_id character varying(36) NOT NULL,
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL
);


ALTER TABLE public.user_attribute OWNER TO admin;

--
-- Name: user_consent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(36) NOT NULL,
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.user_consent OWNER TO admin;

--
-- Name: user_consent_client_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_consent_client_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.user_consent_client_scope OWNER TO admin;

--
-- Name: user_entity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_entity (
    id character varying(36) NOT NULL,
    email character varying(255),
    email_constraint character varying(255),
    email_verified boolean DEFAULT false NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    federation_link character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    realm_id character varying(255),
    username character varying(255),
    created_timestamp bigint,
    service_account_client_link character varying(255),
    not_before integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.user_entity OWNER TO admin;

--
-- Name: user_federation_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_config (
    user_federation_provider_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_config OWNER TO admin;

--
-- Name: user_federation_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    federation_provider_id character varying(36) NOT NULL,
    federation_mapper_type character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.user_federation_mapper OWNER TO admin;

--
-- Name: user_federation_mapper_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_mapper_config (
    user_federation_mapper_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_mapper_config OWNER TO admin;

--
-- Name: user_federation_provider; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_provider (
    id character varying(36) NOT NULL,
    changed_sync_period integer,
    display_name character varying(255),
    full_sync_period integer,
    last_sync integer,
    priority integer,
    provider_name character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.user_federation_provider OWNER TO admin;

--
-- Name: user_group_membership; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_group_membership OWNER TO admin;

--
-- Name: user_required_action; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_required_action (
    user_id character varying(36) NOT NULL,
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL
);


ALTER TABLE public.user_required_action OWNER TO admin;

--
-- Name: user_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_role_mapping (
    role_id character varying(255) NOT NULL,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_role_mapping OWNER TO admin;

--
-- Name: user_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_session (
    id character varying(36) NOT NULL,
    auth_method character varying(255),
    ip_address character varying(255),
    last_session_refresh integer,
    login_username character varying(255),
    realm_id character varying(255),
    remember_me boolean DEFAULT false NOT NULL,
    started integer,
    user_id character varying(255),
    user_session_state integer,
    broker_session_id character varying(255),
    broker_user_id character varying(255)
);


ALTER TABLE public.user_session OWNER TO admin;

--
-- Name: user_session_note; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_session_note (
    user_session character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(2048)
);


ALTER TABLE public.user_session_note OWNER TO admin;

--
-- Name: username_login_failure; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.username_login_failure (
    realm_id character varying(36) NOT NULL,
    username character varying(255) NOT NULL,
    failed_login_not_before integer,
    last_failure bigint,
    last_ip_failure character varying(255),
    num_failures integer
);


ALTER TABLE public.username_login_failure OWNER TO admin;

--
-- Name: web_origins; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.web_origins (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.web_origins OWNER TO admin;

--
-- Name: workflow_stages; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.workflow_stages (
    id integer NOT NULL,
    step_number integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    conditions text,
    deadline_days integer
);


ALTER TABLE public.workflow_stages OWNER TO admin;

--
-- Name: workflow_stages_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.workflow_stages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.workflow_stages_id_seq OWNER TO admin;

--
-- Name: workflow_stages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.workflow_stages_id_seq OWNED BY public.workflow_stages.id;


--
-- Name: workflow_state; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.workflow_state (
    id integer NOT NULL,
    version integer NOT NULL
);


ALTER TABLE public.workflow_state OWNER TO admin;

--
-- Name: workflow_state_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.workflow_state_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.workflow_state_id_seq OWNER TO admin;

--
-- Name: workflow_state_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.workflow_state_id_seq OWNED BY public.workflow_state.id;


--
-- Name: attachments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.attachments_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: catalog_managers id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.catalog_managers ALTER COLUMN id SET DEFAULT nextval('public.catalog_managers_id_seq'::regclass);


--
-- Name: partnership_comments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnership_comments ALTER COLUMN id SET DEFAULT nextval('public.partnership_comments_id_seq'::regclass);


--
-- Name: partnership_requests id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnership_requests ALTER COLUMN id SET DEFAULT nextval('public.partnership_requests_id_seq'::regclass);


--
-- Name: partnerships id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnerships ALTER COLUMN id SET DEFAULT nextval('public.partnerships_id_seq'::regclass);


--
-- Name: programs id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: universities id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.universities ALTER COLUMN id SET DEFAULT nextval('public.universities_id_seq'::regclass);


--
-- Name: workflow_stages id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.workflow_stages ALTER COLUMN id SET DEFAULT nextval('public.workflow_stages_id_seq'::regclass);


--
-- Name: workflow_state id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.workflow_state ALTER COLUMN id SET DEFAULT nextval('public.workflow_state_id_seq'::regclass);


--
-- Data for Name: admin_event_entity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.admin_event_entity (id, admin_event_time, realm_id, operation_type, auth_realm_id, auth_client_id, auth_user_id, ip_address, resource_path, representation, error, resource_type) FROM stdin;
\.


--
-- Data for Name: associated_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.associated_policy (policy_id, associated_policy_id) FROM stdin;
\.


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.attachments (id, partnership_id, file_name, file_url, file_type, uploaded_at, stage_id, file_size, document_type) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.audit_logs (id, user_id, action, entity_name, entity_id, ip_address, "timestamp") FROM stdin;
31	toptalov	IMPORT_CATALOGS_PROCESSED_6_ADDED_9	catalogs	0	172.19.0.1	2026-09-29 17:06:03.732518
32	toptalov	IMPORT_CATALOGS_PROCESSED_5_ADDED_5	catalogs	0	172.19.0.1	2026-09-29 17:06:54.687268
33	toptalov	IMPORT_CATALOGS_PROCESSED_6_ADDED_0	catalogs	0	172.19.0.1	2026-09-29 17:07:04.348032
34	toptalov	CREATE_PARTNERSHIP	partnerships	29	172.19.0.1	2026-09-29 17:07:14.552526
35	toptalov	UPDATE_PARTNERSHIP	partnerships	29	172.19.0.1	2026-09-29 17:07:18.422142
36	toptalov	VIEW_PDN	partnerships	29	172.19.0.1	2026-09-29 17:07:18.42481
37	toptalov	UPDATE_STAGE_TO_5	partnerships	30	172.19.0.1	2026-09-29 17:24:22.120952
38	toptalov	UPDATE_STAGE_TO_5	partnerships	30	172.19.0.1	2026-09-29 17:24:22.12157
40	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:24:22.127637
39	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:24:22.127134
41	toptalov	UPDATE_STAGE_TO_6	partnerships	30	172.19.0.1	2026-09-29 17:24:45.379173
42	toptalov	UPDATE_STAGE_TO_6	partnerships	30	172.19.0.1	2026-09-29 17:24:45.380872
43	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:24:45.382534
44	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:24:45.385755
45	toptalov	UPDATE_PARTNERSHIP	partnerships	31	172.19.0.1	2026-09-29 17:25:38.701539
46	toptalov	VIEW_PDN	partnerships	31	172.19.0.1	2026-09-29 17:25:38.705019
47	toptalov	IMPORT_CATALOGS_PROCESSED_6_ADDED_6	catalogs	0	172.19.0.1	2026-09-29 17:27:25.869957
48	toptalov	UPDATE_PARTNERSHIP	partnerships	30	172.19.0.1	2026-09-29 17:28:07.398218
49	toptalov	UPDATE_PARTNERSHIP	partnerships	30	172.19.0.1	2026-09-29 17:28:07.400121
50	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:28:07.401256
51	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:28:07.403817
52	ivanov	CREATE_PARTNERSHIP	partnerships	32	172.19.0.1	2026-09-29 17:29:15.937933
53	toptalov	UPDATE_STAGE_TO_7	partnerships	30	172.19.0.1	2026-09-29 17:31:24.15644
54	toptalov	UPDATE_STAGE_TO_7	partnerships	30	172.19.0.1	2026-09-29 17:31:24.158566
55	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:31:24.161635
56	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:31:24.163033
57	toptalov	UPDATE_STAGE_TO_8	partnerships	30	172.19.0.1	2026-09-29 17:32:04.3394
58	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:32:04.344289
59	toptalov	UPDATE_STAGE_TO_8	partnerships	30	172.19.0.1	2026-09-29 17:32:04.345062
60	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:32:04.349158
61	toptalov	UPDATE_STAGE_TO_9	partnerships	30	172.19.0.1	2026-09-29 17:32:25.878414
62	toptalov	UPDATE_STAGE_TO_9	partnerships	30	172.19.0.1	2026-09-29 17:32:25.88021
63	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:32:25.882733
64	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:32:25.88425
65	toptalov	UPDATE_STAGE_TO_10	partnerships	30	172.19.0.1	2026-09-29 17:32:40.131873
66	toptalov	UPDATE_STAGE_TO_10	partnerships	30	172.19.0.1	2026-09-29 17:32:40.134879
67	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:32:40.137389
68	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:32:40.13924
69	toptalov	UPDATE_STAGE_TO_11	partnerships	30	172.19.0.1	2026-09-29 17:32:54.254707
70	toptalov	UPDATE_STAGE_TO_11	partnerships	30	172.19.0.1	2026-09-29 17:32:54.256141
71	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:32:54.25732
72	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:32:54.259636
73	toptalov	UPDATE_STAGE_TO_12	partnerships	30	172.19.0.1	2026-09-29 17:33:35.172243
74	toptalov	UPDATE_STAGE_TO_12	partnerships	30	172.19.0.1	2026-09-29 17:33:35.173505
75	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:33:35.175952
76	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:33:35.176451
77	toptalov	UPDATE_STAGE_TO_13	partnerships	30	172.19.0.1	2026-09-29 17:34:04.821568
78	toptalov	UPDATE_STAGE_TO_13	partnerships	30	172.19.0.1	2026-09-29 17:34:04.822505
79	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:34:04.823984
80	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:34:04.825318
81	toptalov	UPDATE_STAGE_TO_14	partnerships	30	172.19.0.1	2026-09-29 17:34:19.906151
82	toptalov	UPDATE_STAGE_TO_14	partnerships	30	172.19.0.1	2026-09-29 17:34:19.907776
83	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:34:19.909535
84	toptalov	VIEW_PDN	partnerships	30	172.19.0.1	2026-09-29 17:34:19.913086
85	ivanov	CREATE_PARTNERSHIP	partnerships	33	172.19.0.1	2026-09-29 18:36:58.849705
86	ivanov	VIEW_PDN	partnerships	33	172.19.0.1	2026-09-29 18:37:08.770812
87	ivanov	VIEW_PDN	partnerships	33	172.19.0.1	2026-09-29 18:37:54.872903
88	ivanov	UPDATE_PARTNERSHIP	partnerships	33	172.19.0.1	2026-09-29 18:38:59.500045
89	ivanov	VIEW_PDN	partnerships	33	172.19.0.1	2026-09-29 18:39:48.229686
90	toptalov	UPDATE_PARTNERSHIP	partnerships	29	172.19.0.1	2026-09-29 18:44:34.677878
91	toptalov	UPDATE_PARTNERSHIP	partnerships	29	172.19.0.1	2026-09-29 18:44:38.055519
92	toptalov	WORKFLOW_ADD	workflow_stages	15	172.19.0.1	2026-09-29 18:45:42.370191
93	toptalov	WORKFLOW_DELETE	workflow_stages	1	172.19.0.1	2026-09-29 18:46:01.741055
94	toptalov	WORKFLOW_EDIT	workflow_stages	3	172.19.0.1	2026-09-29 18:46:11.556543
95	toptalov	WORKFLOW_MOVE	workflow_stages	3	172.19.0.1	2026-09-29 18:46:19.248014
96	toptalov	IMPORT_CATALOGS_PROCESSED_6_ADDED_0	catalogs	0	172.19.0.1	2026-09-29 18:47:41.346424
97	toptalov	VIEW_PDN	partnerships	29	172.19.0.1	2026-09-29 19:14:48.699401
\.


--
-- Data for Name: authentication_execution; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authentication_execution (id, alias, authenticator, realm_id, flow_id, requirement, priority, authenticator_flow, auth_flow_id, auth_config) FROM stdin;
af473351-39bc-48ca-94eb-5f10a6d8337d	\N	auth-cookie	1d7cc020-ca7c-4805-9d61-79a209cf3578	3e26fae9-6896-4da3-b9ef-fd09c490b5cd	2	10	f	\N	\N
d9655520-860f-49aa-be5e-d257ea635b33	\N	auth-spnego	1d7cc020-ca7c-4805-9d61-79a209cf3578	3e26fae9-6896-4da3-b9ef-fd09c490b5cd	3	20	f	\N	\N
5145e5a1-9278-4b25-8403-73f49bca297e	\N	identity-provider-redirector	1d7cc020-ca7c-4805-9d61-79a209cf3578	3e26fae9-6896-4da3-b9ef-fd09c490b5cd	2	25	f	\N	\N
ae04383f-f931-40ed-8847-11db7df3ef51	\N	\N	1d7cc020-ca7c-4805-9d61-79a209cf3578	3e26fae9-6896-4da3-b9ef-fd09c490b5cd	2	30	t	3cb608a2-1b69-4886-a4e1-736145f0996f	\N
6467e4f1-4e45-4364-a946-7d71e1e65336	\N	auth-username-password-form	1d7cc020-ca7c-4805-9d61-79a209cf3578	3cb608a2-1b69-4886-a4e1-736145f0996f	0	10	f	\N	\N
3110d03e-f6e3-44c0-9dba-67c42ad997bb	\N	\N	1d7cc020-ca7c-4805-9d61-79a209cf3578	3cb608a2-1b69-4886-a4e1-736145f0996f	1	20	t	75685cc5-40a4-419d-b053-e3f9da40ae4e	\N
05434bcd-f862-4841-9c3a-1e04269986c2	\N	conditional-user-configured	1d7cc020-ca7c-4805-9d61-79a209cf3578	75685cc5-40a4-419d-b053-e3f9da40ae4e	0	10	f	\N	\N
20ae5675-313b-4296-b4a6-421286940c87	\N	auth-otp-form	1d7cc020-ca7c-4805-9d61-79a209cf3578	75685cc5-40a4-419d-b053-e3f9da40ae4e	0	20	f	\N	\N
50a07456-5029-440a-a227-8fe024ef019b	\N	direct-grant-validate-username	1d7cc020-ca7c-4805-9d61-79a209cf3578	db315fe7-3796-41dc-b9ab-9eb280555a25	0	10	f	\N	\N
2223c8a8-8978-40b5-ba13-c8809d2cddfb	\N	direct-grant-validate-password	1d7cc020-ca7c-4805-9d61-79a209cf3578	db315fe7-3796-41dc-b9ab-9eb280555a25	0	20	f	\N	\N
8aa44d10-fe9c-4c60-96c6-12f2e25bc647	\N	\N	1d7cc020-ca7c-4805-9d61-79a209cf3578	db315fe7-3796-41dc-b9ab-9eb280555a25	1	30	t	e28ef829-27ce-4900-8f34-751dedfc2a9a	\N
47ecd148-b956-44c2-90de-3d9e10aba58a	\N	conditional-user-configured	1d7cc020-ca7c-4805-9d61-79a209cf3578	e28ef829-27ce-4900-8f34-751dedfc2a9a	0	10	f	\N	\N
18f5b930-8ef0-4305-80d1-e1dbd6ecb2eb	\N	direct-grant-validate-otp	1d7cc020-ca7c-4805-9d61-79a209cf3578	e28ef829-27ce-4900-8f34-751dedfc2a9a	0	20	f	\N	\N
affb5982-64f3-416b-b8af-29d298e1e535	\N	registration-page-form	1d7cc020-ca7c-4805-9d61-79a209cf3578	30067a5f-5793-4414-bbd8-22418b2f29c9	0	10	t	a539a834-d5a7-4804-86b2-34533033dbf2	\N
67495732-a11e-4eac-b360-91b9879fd4bd	\N	registration-user-creation	1d7cc020-ca7c-4805-9d61-79a209cf3578	a539a834-d5a7-4804-86b2-34533033dbf2	0	20	f	\N	\N
8f09e38a-256b-4c37-bb2d-909f526a154a	\N	registration-profile-action	1d7cc020-ca7c-4805-9d61-79a209cf3578	a539a834-d5a7-4804-86b2-34533033dbf2	0	40	f	\N	\N
2126370d-5cc0-425c-af33-a6b1a6113f72	\N	registration-password-action	1d7cc020-ca7c-4805-9d61-79a209cf3578	a539a834-d5a7-4804-86b2-34533033dbf2	0	50	f	\N	\N
7632fcda-111f-4029-9ab7-452eff027881	\N	registration-recaptcha-action	1d7cc020-ca7c-4805-9d61-79a209cf3578	a539a834-d5a7-4804-86b2-34533033dbf2	3	60	f	\N	\N
d4b0c7cc-27dc-4f1d-9f18-d966d547dfdf	\N	registration-terms-and-conditions	1d7cc020-ca7c-4805-9d61-79a209cf3578	a539a834-d5a7-4804-86b2-34533033dbf2	3	70	f	\N	\N
078ba12e-655a-430d-a206-cecb76879594	\N	reset-credentials-choose-user	1d7cc020-ca7c-4805-9d61-79a209cf3578	0c0c688f-e940-4241-b556-773e340fb8f4	0	10	f	\N	\N
deaab30f-f5e4-402b-a0bb-d735aac35527	\N	reset-credential-email	1d7cc020-ca7c-4805-9d61-79a209cf3578	0c0c688f-e940-4241-b556-773e340fb8f4	0	20	f	\N	\N
9984c814-edcd-4b54-b3c3-0352dc70fbfa	\N	reset-password	1d7cc020-ca7c-4805-9d61-79a209cf3578	0c0c688f-e940-4241-b556-773e340fb8f4	0	30	f	\N	\N
9d30e0ec-7a74-4b24-b8ab-94ac7a7c7791	\N	\N	1d7cc020-ca7c-4805-9d61-79a209cf3578	0c0c688f-e940-4241-b556-773e340fb8f4	1	40	t	30b4d1c7-c70a-4a3f-b9df-5126b8d26efa	\N
7e211001-f947-4f2d-9322-4d08ce4123b4	\N	conditional-user-configured	1d7cc020-ca7c-4805-9d61-79a209cf3578	30b4d1c7-c70a-4a3f-b9df-5126b8d26efa	0	10	f	\N	\N
dd1e3b7a-aaad-46e8-bbc6-361cce39d0cb	\N	reset-otp	1d7cc020-ca7c-4805-9d61-79a209cf3578	30b4d1c7-c70a-4a3f-b9df-5126b8d26efa	0	20	f	\N	\N
227ea225-bafa-4e61-844e-813ea3094fa8	\N	client-secret	1d7cc020-ca7c-4805-9d61-79a209cf3578	ccf2aa46-cb35-4634-a57b-19468ccfb8c2	2	10	f	\N	\N
b1e5a065-9931-4601-a2bb-14f2e63fb0f7	\N	client-jwt	1d7cc020-ca7c-4805-9d61-79a209cf3578	ccf2aa46-cb35-4634-a57b-19468ccfb8c2	2	20	f	\N	\N
318d9879-5700-4a28-9c26-df093225c047	\N	client-secret-jwt	1d7cc020-ca7c-4805-9d61-79a209cf3578	ccf2aa46-cb35-4634-a57b-19468ccfb8c2	2	30	f	\N	\N
f24401db-01ab-43db-8465-5cd1f406cd9f	\N	client-x509	1d7cc020-ca7c-4805-9d61-79a209cf3578	ccf2aa46-cb35-4634-a57b-19468ccfb8c2	2	40	f	\N	\N
3f3a93ac-3a68-4bf4-a390-defe72bc0de5	\N	idp-review-profile	1d7cc020-ca7c-4805-9d61-79a209cf3578	4912c303-2a93-42c6-9530-99b3046f7206	0	10	f	\N	93ce7452-0ef3-4619-bd1c-ca47e89eb744
dd7d1745-d898-4b43-95e6-4d038f062e6e	\N	\N	1d7cc020-ca7c-4805-9d61-79a209cf3578	4912c303-2a93-42c6-9530-99b3046f7206	0	20	t	be4ee6f6-9b11-4590-86a7-b6597a815fc1	\N
28f96544-c3cd-4af6-b2f3-97e87a3e4927	\N	idp-create-user-if-unique	1d7cc020-ca7c-4805-9d61-79a209cf3578	be4ee6f6-9b11-4590-86a7-b6597a815fc1	2	10	f	\N	d83f0c54-36c2-4b4f-8165-4fbe9e483556
c271b61b-fc17-45eb-9911-3d5944db2d6a	\N	\N	1d7cc020-ca7c-4805-9d61-79a209cf3578	be4ee6f6-9b11-4590-86a7-b6597a815fc1	2	20	t	aa2cfcfa-c72d-45df-b216-ffed56bbfcf2	\N
bb3e9f2a-4c7a-418c-b40b-cc59440e84ac	\N	idp-confirm-link	1d7cc020-ca7c-4805-9d61-79a209cf3578	aa2cfcfa-c72d-45df-b216-ffed56bbfcf2	0	10	f	\N	\N
a4279155-9a7e-445d-aec3-b9be7453783a	\N	\N	1d7cc020-ca7c-4805-9d61-79a209cf3578	aa2cfcfa-c72d-45df-b216-ffed56bbfcf2	0	20	t	8c40a3f2-f182-4280-9e20-a2e223ecfa87	\N
27a9932c-bc4d-4d4a-9284-c7da49445793	\N	idp-email-verification	1d7cc020-ca7c-4805-9d61-79a209cf3578	8c40a3f2-f182-4280-9e20-a2e223ecfa87	2	10	f	\N	\N
a21b1c7f-8f64-4028-8d53-37cd182fb7d4	\N	\N	1d7cc020-ca7c-4805-9d61-79a209cf3578	8c40a3f2-f182-4280-9e20-a2e223ecfa87	2	20	t	571f342c-aa80-4d18-96a9-844d76418643	\N
c54601e8-9d2a-4136-a40c-b4de575beba2	\N	idp-username-password-form	1d7cc020-ca7c-4805-9d61-79a209cf3578	571f342c-aa80-4d18-96a9-844d76418643	0	10	f	\N	\N
7e8132fc-3ef2-4444-8a65-10ada7fbd524	\N	\N	1d7cc020-ca7c-4805-9d61-79a209cf3578	571f342c-aa80-4d18-96a9-844d76418643	1	20	t	1ba20bb4-fad7-44ef-80bd-7b42cfedd02e	\N
7469ab09-e8fb-438c-b12d-2234be07d1d5	\N	conditional-user-configured	1d7cc020-ca7c-4805-9d61-79a209cf3578	1ba20bb4-fad7-44ef-80bd-7b42cfedd02e	0	10	f	\N	\N
b7e418f6-9055-4acd-9634-efcb3026b9f4	\N	auth-otp-form	1d7cc020-ca7c-4805-9d61-79a209cf3578	1ba20bb4-fad7-44ef-80bd-7b42cfedd02e	0	20	f	\N	\N
8af022cc-4236-497c-a0e5-7dd8f2b90507	\N	http-basic-authenticator	1d7cc020-ca7c-4805-9d61-79a209cf3578	2a2bf6c8-ceb7-45bd-8a6f-af054aee8c61	0	10	f	\N	\N
f67438e8-6ddc-4155-b233-057cbb864364	\N	docker-http-basic-authenticator	1d7cc020-ca7c-4805-9d61-79a209cf3578	95f4b259-ee42-4579-8ff4-2ff4f179d115	0	10	f	\N	\N
010027cc-7252-4ccb-8d63-cb1c88b8d28d	\N	auth-cookie	f8993e77-a2d6-4198-b3cd-9ad9cde21761	b9464eae-66b6-4d68-8d8d-b0a1a0e24cde	2	10	f	\N	\N
b1817297-a6ae-4681-b164-e927261407a5	\N	auth-spnego	f8993e77-a2d6-4198-b3cd-9ad9cde21761	b9464eae-66b6-4d68-8d8d-b0a1a0e24cde	3	20	f	\N	\N
8eec1f04-d062-41ca-920b-61b87bfc538b	\N	identity-provider-redirector	f8993e77-a2d6-4198-b3cd-9ad9cde21761	b9464eae-66b6-4d68-8d8d-b0a1a0e24cde	2	25	f	\N	\N
278b4265-7961-4e00-892f-d1a63a281741	\N	\N	f8993e77-a2d6-4198-b3cd-9ad9cde21761	b9464eae-66b6-4d68-8d8d-b0a1a0e24cde	2	30	t	0599c56c-4b9b-4dd9-adcc-e3bd1e8f1be0	\N
9ba95d90-69b3-43cf-b778-dc71286bcea1	\N	auth-username-password-form	f8993e77-a2d6-4198-b3cd-9ad9cde21761	0599c56c-4b9b-4dd9-adcc-e3bd1e8f1be0	0	10	f	\N	\N
e8f449e2-7199-44bb-93c1-22defac8e265	\N	\N	f8993e77-a2d6-4198-b3cd-9ad9cde21761	0599c56c-4b9b-4dd9-adcc-e3bd1e8f1be0	1	20	t	dce85545-13a5-41e7-b24a-3729314ae6c8	\N
748fa4b7-1261-4686-85ec-dc1bdf8221b1	\N	conditional-user-configured	f8993e77-a2d6-4198-b3cd-9ad9cde21761	dce85545-13a5-41e7-b24a-3729314ae6c8	0	10	f	\N	\N
f5bd2bf9-32e2-43d2-a796-4d86dfcd6412	\N	auth-otp-form	f8993e77-a2d6-4198-b3cd-9ad9cde21761	dce85545-13a5-41e7-b24a-3729314ae6c8	0	20	f	\N	\N
f25ff195-603c-41b8-b76d-3ccccf806046	\N	direct-grant-validate-username	f8993e77-a2d6-4198-b3cd-9ad9cde21761	06f68501-054d-404c-9209-06d2f08b8949	0	10	f	\N	\N
60338bf7-4edc-489e-9e92-2c8871787b56	\N	direct-grant-validate-password	f8993e77-a2d6-4198-b3cd-9ad9cde21761	06f68501-054d-404c-9209-06d2f08b8949	0	20	f	\N	\N
a9f7c81c-fce2-4086-89f3-b99d48d16bb7	\N	\N	f8993e77-a2d6-4198-b3cd-9ad9cde21761	06f68501-054d-404c-9209-06d2f08b8949	1	30	t	a73e71c0-7bcd-4dfa-a72f-94b9446024a1	\N
06fc5bd0-50b0-4f3f-9407-027677703752	\N	conditional-user-configured	f8993e77-a2d6-4198-b3cd-9ad9cde21761	a73e71c0-7bcd-4dfa-a72f-94b9446024a1	0	10	f	\N	\N
99c7808e-9f30-4126-aa5a-96bb31fb6dd3	\N	direct-grant-validate-otp	f8993e77-a2d6-4198-b3cd-9ad9cde21761	a73e71c0-7bcd-4dfa-a72f-94b9446024a1	0	20	f	\N	\N
93e03866-0d86-4586-815a-05da1e81a174	\N	registration-page-form	f8993e77-a2d6-4198-b3cd-9ad9cde21761	859451b2-85d6-48c1-abe9-bd4d47e79b61	0	10	t	7909459b-99c9-4e8f-8e4b-50ef41063c33	\N
2ccec23c-7855-4ee5-a158-aaea1761e6fa	\N	registration-user-creation	f8993e77-a2d6-4198-b3cd-9ad9cde21761	7909459b-99c9-4e8f-8e4b-50ef41063c33	0	20	f	\N	\N
54d6e981-81da-46cd-962f-c2b9a679e9c4	\N	registration-profile-action	f8993e77-a2d6-4198-b3cd-9ad9cde21761	7909459b-99c9-4e8f-8e4b-50ef41063c33	0	40	f	\N	\N
22c74047-f41f-4718-ad59-c4a0b1b063db	\N	registration-password-action	f8993e77-a2d6-4198-b3cd-9ad9cde21761	7909459b-99c9-4e8f-8e4b-50ef41063c33	0	50	f	\N	\N
5f58bab0-e5d2-4008-b095-bb60c541939e	\N	registration-recaptcha-action	f8993e77-a2d6-4198-b3cd-9ad9cde21761	7909459b-99c9-4e8f-8e4b-50ef41063c33	3	60	f	\N	\N
3d4d48b6-c84b-48f4-8060-5723f8f4a654	\N	reset-credentials-choose-user	f8993e77-a2d6-4198-b3cd-9ad9cde21761	79ecaba9-185c-4dc1-a115-b1789d9fe399	0	10	f	\N	\N
0ad47d44-61a6-4ea4-bd26-da4c1d7617e3	\N	reset-credential-email	f8993e77-a2d6-4198-b3cd-9ad9cde21761	79ecaba9-185c-4dc1-a115-b1789d9fe399	0	20	f	\N	\N
89fcd8a0-2458-40ac-ba21-3382a39bcc83	\N	reset-password	f8993e77-a2d6-4198-b3cd-9ad9cde21761	79ecaba9-185c-4dc1-a115-b1789d9fe399	0	30	f	\N	\N
b073ec58-b0e7-47ea-8c2e-31bba71ccd6d	\N	\N	f8993e77-a2d6-4198-b3cd-9ad9cde21761	79ecaba9-185c-4dc1-a115-b1789d9fe399	1	40	t	7b35160b-1915-48b3-969f-0384c5d732cf	\N
20240f30-d0a5-4212-b06b-bdcab4ef97b9	\N	conditional-user-configured	f8993e77-a2d6-4198-b3cd-9ad9cde21761	7b35160b-1915-48b3-969f-0384c5d732cf	0	10	f	\N	\N
9788faf4-4f4b-4fb8-8b06-ee5a4c431fa0	\N	reset-otp	f8993e77-a2d6-4198-b3cd-9ad9cde21761	7b35160b-1915-48b3-969f-0384c5d732cf	0	20	f	\N	\N
4573d4ab-418c-4145-958b-18d4164f29bd	\N	client-secret	f8993e77-a2d6-4198-b3cd-9ad9cde21761	7c7c1420-5426-4e3e-8206-a00025375295	2	10	f	\N	\N
fa71cba3-48b2-4901-879e-0c19f51fd79f	\N	client-jwt	f8993e77-a2d6-4198-b3cd-9ad9cde21761	7c7c1420-5426-4e3e-8206-a00025375295	2	20	f	\N	\N
e76fff9f-00a3-46ee-aa2c-eb900ead4c8b	\N	client-secret-jwt	f8993e77-a2d6-4198-b3cd-9ad9cde21761	7c7c1420-5426-4e3e-8206-a00025375295	2	30	f	\N	\N
39790fd9-e7aa-49a5-aab9-23978b89aa67	\N	client-x509	f8993e77-a2d6-4198-b3cd-9ad9cde21761	7c7c1420-5426-4e3e-8206-a00025375295	2	40	f	\N	\N
2d9dfbbb-40a5-4d95-b5f4-627647a18b09	\N	idp-review-profile	f8993e77-a2d6-4198-b3cd-9ad9cde21761	b31a1d09-45b0-41c7-bde2-839e79f19c6d	0	10	f	\N	3bd975d1-c2bf-4f11-9827-f16df588b9d4
738a7298-875a-45fe-939b-c460e8998c0f	\N	\N	f8993e77-a2d6-4198-b3cd-9ad9cde21761	b31a1d09-45b0-41c7-bde2-839e79f19c6d	0	20	t	93eb922f-87d2-44fb-b2d4-1dce7d0c40f1	\N
be34643b-631e-4883-86a3-7ca3ca6904b3	\N	idp-create-user-if-unique	f8993e77-a2d6-4198-b3cd-9ad9cde21761	93eb922f-87d2-44fb-b2d4-1dce7d0c40f1	2	10	f	\N	5a315afa-ca48-4c8f-a9d8-7d3abdabac6a
dd65e068-48f1-42cb-bb8c-cd3b6df366c4	\N	\N	f8993e77-a2d6-4198-b3cd-9ad9cde21761	93eb922f-87d2-44fb-b2d4-1dce7d0c40f1	2	20	t	b8e0f22e-1de7-4785-8683-195b1af0f29d	\N
868cfdf5-ae3b-4ade-92ed-a8bdca227616	\N	idp-confirm-link	f8993e77-a2d6-4198-b3cd-9ad9cde21761	b8e0f22e-1de7-4785-8683-195b1af0f29d	0	10	f	\N	\N
8a617b3c-bf76-4097-9d72-375df5fa7df4	\N	\N	f8993e77-a2d6-4198-b3cd-9ad9cde21761	b8e0f22e-1de7-4785-8683-195b1af0f29d	0	20	t	93f3b1c8-1381-4020-9757-818b31854a84	\N
04fbab66-b4b2-4aa1-a18c-808802fd5dc9	\N	idp-email-verification	f8993e77-a2d6-4198-b3cd-9ad9cde21761	93f3b1c8-1381-4020-9757-818b31854a84	2	10	f	\N	\N
be87dc07-a3e0-4b8a-bf2e-4f93bc314db9	\N	\N	f8993e77-a2d6-4198-b3cd-9ad9cde21761	93f3b1c8-1381-4020-9757-818b31854a84	2	20	t	e3346f6a-dd49-42dc-88b8-90b1838552f6	\N
7a9335bf-63a0-4675-b353-5f9914e2ad08	\N	idp-username-password-form	f8993e77-a2d6-4198-b3cd-9ad9cde21761	e3346f6a-dd49-42dc-88b8-90b1838552f6	0	10	f	\N	\N
1bf26137-7f74-4431-99bf-252b1c00a61f	\N	\N	f8993e77-a2d6-4198-b3cd-9ad9cde21761	e3346f6a-dd49-42dc-88b8-90b1838552f6	1	20	t	214b7b18-275c-4fdb-86e0-788c73f5c9fe	\N
a509338e-ef3f-4648-8d30-3d5f27024e71	\N	conditional-user-configured	f8993e77-a2d6-4198-b3cd-9ad9cde21761	214b7b18-275c-4fdb-86e0-788c73f5c9fe	0	10	f	\N	\N
43b8dc8d-f654-444f-af91-dc3aa4da5031	\N	auth-otp-form	f8993e77-a2d6-4198-b3cd-9ad9cde21761	214b7b18-275c-4fdb-86e0-788c73f5c9fe	0	20	f	\N	\N
84930cf8-7149-42e2-8ec0-843d704136c9	\N	http-basic-authenticator	f8993e77-a2d6-4198-b3cd-9ad9cde21761	fc801c7e-f096-421d-82a0-56e732a67cd3	0	10	f	\N	\N
3fbf933b-6bd6-4319-93e8-b00445461581	\N	docker-http-basic-authenticator	f8993e77-a2d6-4198-b3cd-9ad9cde21761	5b4023d6-3a8f-4e3b-b9a8-14d01f939c67	0	10	f	\N	\N
\.


--
-- Data for Name: authentication_flow; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authentication_flow (id, alias, description, realm_id, provider_id, top_level, built_in) FROM stdin;
3e26fae9-6896-4da3-b9ef-fd09c490b5cd	browser	browser based authentication	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	t	t
3cb608a2-1b69-4886-a4e1-736145f0996f	forms	Username, password, otp and other auth forms.	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	f	t
75685cc5-40a4-419d-b053-e3f9da40ae4e	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	f	t
db315fe7-3796-41dc-b9ab-9eb280555a25	direct grant	OpenID Connect Resource Owner Grant	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	t	t
e28ef829-27ce-4900-8f34-751dedfc2a9a	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	f	t
30067a5f-5793-4414-bbd8-22418b2f29c9	registration	registration flow	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	t	t
a539a834-d5a7-4804-86b2-34533033dbf2	registration form	registration form	1d7cc020-ca7c-4805-9d61-79a209cf3578	form-flow	f	t
0c0c688f-e940-4241-b556-773e340fb8f4	reset credentials	Reset credentials for a user if they forgot their password or something	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	t	t
30b4d1c7-c70a-4a3f-b9df-5126b8d26efa	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	f	t
ccf2aa46-cb35-4634-a57b-19468ccfb8c2	clients	Base authentication for clients	1d7cc020-ca7c-4805-9d61-79a209cf3578	client-flow	t	t
4912c303-2a93-42c6-9530-99b3046f7206	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	t	t
be4ee6f6-9b11-4590-86a7-b6597a815fc1	User creation or linking	Flow for the existing/non-existing user alternatives	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	f	t
aa2cfcfa-c72d-45df-b216-ffed56bbfcf2	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	f	t
8c40a3f2-f182-4280-9e20-a2e223ecfa87	Account verification options	Method with which to verity the existing account	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	f	t
571f342c-aa80-4d18-96a9-844d76418643	Verify Existing Account by Re-authentication	Reauthentication of existing account	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	f	t
1ba20bb4-fad7-44ef-80bd-7b42cfedd02e	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	f	t
2a2bf6c8-ceb7-45bd-8a6f-af054aee8c61	saml ecp	SAML ECP Profile Authentication Flow	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	t	t
95f4b259-ee42-4579-8ff4-2ff4f179d115	docker auth	Used by Docker clients to authenticate against the IDP	1d7cc020-ca7c-4805-9d61-79a209cf3578	basic-flow	t	t
b9464eae-66b6-4d68-8d8d-b0a1a0e24cde	browser	browser based authentication	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	t	t
0599c56c-4b9b-4dd9-adcc-e3bd1e8f1be0	forms	Username, password, otp and other auth forms.	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	f	t
dce85545-13a5-41e7-b24a-3729314ae6c8	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	f	t
06f68501-054d-404c-9209-06d2f08b8949	direct grant	OpenID Connect Resource Owner Grant	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	t	t
a73e71c0-7bcd-4dfa-a72f-94b9446024a1	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	f	t
859451b2-85d6-48c1-abe9-bd4d47e79b61	registration	registration flow	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	t	t
7909459b-99c9-4e8f-8e4b-50ef41063c33	registration form	registration form	f8993e77-a2d6-4198-b3cd-9ad9cde21761	form-flow	f	t
79ecaba9-185c-4dc1-a115-b1789d9fe399	reset credentials	Reset credentials for a user if they forgot their password or something	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	t	t
7b35160b-1915-48b3-969f-0384c5d732cf	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	f	t
7c7c1420-5426-4e3e-8206-a00025375295	clients	Base authentication for clients	f8993e77-a2d6-4198-b3cd-9ad9cde21761	client-flow	t	t
b31a1d09-45b0-41c7-bde2-839e79f19c6d	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	t	t
93eb922f-87d2-44fb-b2d4-1dce7d0c40f1	User creation or linking	Flow for the existing/non-existing user alternatives	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	f	t
b8e0f22e-1de7-4785-8683-195b1af0f29d	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	f	t
93f3b1c8-1381-4020-9757-818b31854a84	Account verification options	Method with which to verity the existing account	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	f	t
e3346f6a-dd49-42dc-88b8-90b1838552f6	Verify Existing Account by Re-authentication	Reauthentication of existing account	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	f	t
214b7b18-275c-4fdb-86e0-788c73f5c9fe	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	f	t
fc801c7e-f096-421d-82a0-56e732a67cd3	saml ecp	SAML ECP Profile Authentication Flow	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	t	t
5b4023d6-3a8f-4e3b-b9a8-14d01f939c67	docker auth	Used by Docker clients to authenticate against the IDP	f8993e77-a2d6-4198-b3cd-9ad9cde21761	basic-flow	t	t
\.


--
-- Data for Name: authenticator_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authenticator_config (id, alias, realm_id) FROM stdin;
93ce7452-0ef3-4619-bd1c-ca47e89eb744	review profile config	1d7cc020-ca7c-4805-9d61-79a209cf3578
d83f0c54-36c2-4b4f-8165-4fbe9e483556	create unique user config	1d7cc020-ca7c-4805-9d61-79a209cf3578
3bd975d1-c2bf-4f11-9827-f16df588b9d4	review profile config	f8993e77-a2d6-4198-b3cd-9ad9cde21761
5a315afa-ca48-4c8f-a9d8-7d3abdabac6a	create unique user config	f8993e77-a2d6-4198-b3cd-9ad9cde21761
\.


--
-- Data for Name: authenticator_config_entry; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authenticator_config_entry (authenticator_id, value, name) FROM stdin;
93ce7452-0ef3-4619-bd1c-ca47e89eb744	missing	update.profile.on.first.login
d83f0c54-36c2-4b4f-8165-4fbe9e483556	false	require.password.update.after.registration
3bd975d1-c2bf-4f11-9827-f16df588b9d4	missing	update.profile.on.first.login
5a315afa-ca48-4c8f-a9d8-7d3abdabac6a	false	require.password.update.after.registration
\.


--
-- Data for Name: broker_link; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.broker_link (identity_provider, storage_provider_id, realm_id, broker_user_id, broker_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: catalog_import_jobs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.catalog_import_jobs (id, owner_id, catalog, payload, result, created_at) FROM stdin;
d4baaa90-18c6-4568-8856-83a347b6b249	toptalov	interactions	gAAAAABqu-7udIVXIOh-Zu1dV62mQatZIqmq2ffcXtSBNT8FoDebQvveitM2N_CcCOBrDg2IQLQLgCle_Kw4kER2RufpD5FjIvqKJmoet3Vq1p4kB0i-Y8NT7SL6UbPL14e0ekNrchucaDN7HD6O64NEdn7O0mHDzsYG3uCCr_kyWfOQjvA9C-LL2fh7OnLFSXkWXxvwOILTbUl6uTPU_m9tg34WSq4iMnhTy71z8iFRZ2iojbgk-_k2zoXTAeybiUx70UbzP-Z6uUL0Aey0gR4IHHkSdt03K1yBCpL4DK6JAV5t1Uv97JGuRe6bLnyT8s_3bpT1-47Qrjc77dT0jA8VGEcGE-qk3Ora2RPe69nZVAEHq__X4SrY4XiMTMSNiU1SNKCCBWdwYDhDil6WKiqizZeHttR0PuidfitlLtxmTbT0EuQMGQMKDtjXdH5Xwty1Q0ki_lrn-yFZr19tSSIs3B3F5w-1ugoX9CxEV3RBvjpgcLItxhsiSG12hirTFrXGTtMmWgKA1d81KA63FcnXpvWAQYMjyq-BzOj_iD6MLzJ2regfNaBwDMtoFV8PPBvu72P0sONmSn3gsLt58sG80v4qrH-lxD8q8iUIitm0UGq6bfWzdzj3Cinzkf05YkhlDBHnB6duUcP_Fjspu4hzBhNNWIV1taM2sdNB6Q90S8cADxoo0Z76Z_58X651TAkYhfIVkM3Kn-fcmUgsDZSt60iWQvBI4WwmZ66l9TORO4L5q9jM_USMykDplzpCg2MA8iAryDItzXGDUbWxAVBOPeo4y9j8bolpvAjLBOkulDEe3DGWuTLHna-1-NM8vQHd9nk2YSGZcjMUVOKGBLHVsO6rN6rpIeOKm3Tk7CLxMqUa0bNnABBZyLUFLm_b2B0VHJEUJULNqo4Xal2RyHR7X7sbZVEKs3SsXtDNM-0YqgDjWc-FeBD-c55npN-y7BTLz2wG3XWQPnXcnXd9q3-rXDeAZdJSI6gRQosEK-k0UdOYDWGomPfcBXNC-eFNa-EGEEWHFQC6x35fnP5Z0eb9tcs-w0ppErYsy1CO5QdC3YcagjEPXE_yZGoxAGFqLiB8sTC8X-fwczFsvCP1e9mrhkrffEHJzDwP038BhdtauG1dCREoA2HzfJ5saSziBv6AniMMGDZ9PuncHSg8VSmeOvSxWKlw1INNTks_rYzuNtYyRos5CO85ZjILhGXT0XJ4ng20cghMKdwj9ke2wPAEQrjRkEl2OpPDo7IAaA-Gfi-ZoyzhmJqfB2uKPrueHgzap1685a4tLVV3k6fAfVwlY5w7bP0kDH8yJF8QNIw3f91YNOPN3BsOz99h-Nlw5T78BocBqHbQLi436eE6nx2UBuXvkBCoe746gznGAxI5XWnKuVTA8pHNoT1TVO43BndVD2u2fwvAykY0AHQCtb0EeJiOS8Kv8r1V_shPTZ_ozY0LPWig3TvAAWydpIkt5XN42ty2g4VVphydTsHKyXDeHFudUWCUWGeXZFkWI75I4_XnJF98Vurlw4ELRgrrf9V1S2OEMvr_CIpehqJXrdLt0lL8RV7b-MXrTF1d6ndhVifsa35JY7G18Y3ZqmI5f_DSmLgzNm_n79_wwIUopfOpnCdRb-Inh1-M4-bIgppEqwKGbyx9FxTAvp7VUKnHYerqvl2KRqCxlHk3oBxul0jqzexkLyTw_UnqR8fI5cxZzgk_sNXihIsdjOiQ0_drx9WErWxLrZHtO5STAhvKvg84sZG6Yh6zy8l84U8wyzqwTMu1M4KT-lkOfbqwSzF_ufT9M19Nw6D7tGj1CGv6EW73tLC8Hk_BZ40Gq8sIG42dxWVp3RdiuSzGGoP5QQwdIdW-a_IQj93cWySf1uAST8yvtxm1h8L8TMxJy8MpJe-4zweqYOQK4w3BjNn3CfcNTlnwZ9UfVHJhELKCzNdC7P0mA-9zWOxE2y_5oyIus1zqxPX6S6NNb4dolcHnO-ZpBJiYpLlC4LNzk132LtcX3mu0_lMin43rkt82YmM590ATIqwFmGJYiXvAfaKMuFBPuYidwCmstkQUM24XgmMCaNK0VD4CiR8wfugMIVHGF2pQod78EZQVpNoOyJiB992xrEPtGD6CBe9uCqGdHc5d_U7YE2mzjW25QkpAi-iV6TB7njq-Tr6EkqJy1wDeGdqhAfHITU_U-fAf5mb6yVIRL_7TWM3bIvxjg-Ui1mt7XkOA7DZJrWUazciT40pvpOAoUFYQ0U6ZSMfp6VO_Mx3mZZQK_IzgCmI1wYj9ywXSY5XFltDjnfbU5qYmesF4XQ37-378Gz3fvi9Z8SOL5VOAVPUpms26oB9TTdfvvYsT6wA-3e6M7Ge7yWQzM0BjTHUsXZJ2SzdptDSwAy_ApAQqY2KtejXQbwNBPhUquzzFYJbFARoLlcSfASjtYXtoUyhzPLoaqZz7a8wVVHkaW_K6rYUlRPMY5aOCr-4H_sb--pemssujNemRRrTUYXQezOLeZEPc4HWN7NEiv3QFRI9yh2pyp-rNNvIY6OZ9n0F-ni-GVnYn4qfzZ8wiiw75yjYt-QeRdhgKqj2HuBpb8fU2HgW83Mr60WZqeEt7v-DrzAwGKsZDJwuRBg4RzFsT5cvraFL0DWPpythHBLoR3B0h6g2IAvOlPK4PMWCr0RojyPjGBE4OXKPkO1K49k_OapJgmvWCO4svNXrRq43aroRqOaqaseepZjXVB664VqbJxpdNtzpDoZW_6fDi58Pw8yI4ci3N-IeTQBRCjMA4ZNJWmGxDFqrPtdGyEwNzYYP3ASLwsQxmSD7o9urtcdhJ3-EoxH5a56utm3hi2HPtsSJ8eXjCCC3Mm60g8M4_pYq6UY3c6RyXCe2bJepN3PtQA3bjru-MTA9J4xtmKTZndwMfoYPrwvlCt7XiyfCwuMyFdXJz3_smeNWRmtI2KZr4GXx1lERtj_JSnStQWWGJ_AtCBTockIVXyJDr8iPTyV4edYghRTeYV87xeOU__BFuPMHexjseNWd7HVKMSA-SXu5qfrAXzFw_sYGJs7eigQ7zIPfU00HnXvlAKJpTZpCASrdfiDzNaiP8Uz9bbynZS-GBJskODfrcMCi3cB7Ss_ZAy-3VE7_zyEZvZZ7KtxFOtj-cmUJ3LjynNzLFKgRey1P5MdQZ5p0m2skFXAacfg-4678J-eYQ6_LoNyn2oDBO4QAWLEFp4fKKhJYX-uy6u65mdaqM5bxqVqcfjDPYazswrx7UTJkaMOn9QOKhUpZej12pWArMc1ySAQ9Cd6G8yehYqSXMVf-fZwY6UGklYqzxW9rtLmrNcFhAuCoNv6ODawSoqChmtxsSLqWOm-2-qRVoVWIw6M0uff5pnrLPB7s2lM-TaEcH9_N685PQUB8Ih9sXQ7U5Rj2kIi-NiWeJjyk1nRcMXP-1YHXNqKFJp0QnZCKjVVwwFl_YMIdH4RxsTWnMpfBeJmN9hNi0rWxQhL0vzPI96zHBJLU8rkAgXT7KQBDzIhbiYYV7Tq08qsyLWkDCs86cBCkr6KdJtoDmRPu1xZSf9GYg4V5rpw4amVFU8J6PI9DxFNqlHvhdgk6wdabIpV2-OdBrsJm1h3ANRD6HBgULXDTpI8gDGDMMfyLOLt0rq4C7hUYh61HXXDSf-uL7a0wFijHmtgurJd2WSP6mIXsKFN2zS57Lg4tHdlqV1B_K1Zjv9myYrpivylWHUTwJEy1y1yuGR1MCgLDHrmGvAYm3pG-s0G_Nh9CVAh9LVV6F5dR_rS4-fl3HJtzYIKX3YQTs_AdJmAEDa2zF2gP3uWSfOgTMOIxNqI-ffotcHyIE1J5yIvYBEX9i7R_tS3eSBNMvUAmkWq7WvLjYEjVpGw36NtiJ7z6x-w_YAK2CZ9KV1QwAv9vAmifx2XAYjIjNG7j4NQ9CEBfZVnV1gvq7IqJXcvxGGi0zkF5E4rnJkK9YOK6NBpLRhuxJVbjtCJo2RHFNwAGzEOOf-wD3bq5Chu5wlFqXyypNCnwD5JoqeDjj4mnYGFODDiWPdwLG9CSxma2zKZ-WQVF01H555iPQxDhjNHdn1EaRKN9JFH1SwZwtTHmZSdDZM4Jg4Kv90pKzdDuyi6ZI-cRLR_d-xN9YbLF7ARGvwOrGucTXhGD7KxfB_4a4VvDIpn8Ai0QKHt42QeyEqomgW4-rG6RkbHCJGDWY2Adh_lHAIYZ5kb-06J5xxyhnl2AokgATdagz2Ka9TAkN5QjMZ78aFp1uI2_Y9MXX8KOClbmQeheSIzjSTRjQkqqBThNifZeehOxHAN9rMJBc7DoKm5FVZ6EjebGjSauVW7Vd-xLoHwercpFU3ETbhyDwOs58XRGK5oXR0K1lSGtk59oGIqBaOxmwpqLNbSNNkyxDW1TuP-qGlZaEI1w_YGhOLtTpoVuY55shXTKQHG-QpHCMgYw_7hQzlhNxTYTDStCXCzyRPEO-B1bgmQBPLDG3J_dxZZWeW6nt7Ootk0eg7CQzruws99EZcJjJK5sz-9wasxoXKGsMcYZwhJ6IIpvc7g741XFb8Oorf_vJgYU93q3FPOsueoMtYsbCIuW1pghccCVfV2f460Z7SiJLUHmPT2a4k_TunhDgcJXar2eYPxTgiqvSJ7K5bSPpbBmx_MybtJaJltl6ERHXQeeju54aU63eJwOaQK0-PxdZ4ZCJPjlVwcomsfyajlmc6zYSXoS2RhA3RelY_kSyyQHs3Lbqdb7aoTWU1mqVXp_Db4XTM9ElvtfsQZhWIeyIcrRhC3QCE0hCoRobuZyvRemDlWb1GrmsPaXcpNb6EKKj3dxu8uJorDgnXLpgxPMoyvD8zAB5WvpuM7hfTavX2OKRxSbzZBYdTo2NyBPzd733yF2HEP3C2uuAK0AOy4-gsOS1FXj3450dL2zgZNKU_1xqHTFTwfvxECdFVralRvnyblIZ0PP_2ZahllZBB5F3igSsSeFsH9zV9mVk6ia_2aWwRbTYOyIuciXBAWHm5AV3OWYmi-toPV8txvTZzX8SyHwXzoubdQ39hAjSgHf00slXA56SrZ5x2NzGC04NgnuPSV7tBn-qw17vU7tmzaXTgkSTHkQCnCJ8iKp2yl6qSEvr3jsRrttJyc2J7u9h8PchCUMCE52plmLha77KBubY-A_L_Zx8niUWcB95w0-I2Zp1elUkSLcbpSsGzrvKD33fVwDFdWYa4hsp5w85CbV50e7QYiq_A0vFCY_vyGdzZ2j8OrKMgnBJW2LuObDSqgD0Z76ce9SrVRpN7PokXau7vH3z-SYJdvykRmxac5RdiOJHg2Gmdu3FWpyMWHRdYKJ1bF2u1enDZNcujU15z9I43DMfUzheDPMwmqi1SV9kWizU-5_8vNTRhKGk8TDmtkuvfwPWzPAV3ZB7L8mmJ0XiqEdRjcmugqW1dhAKW1JyYxDUrOi-hpSbErpteAmdAkydn6NIk4-hn_4vZewJ7Zu4C-xBeteUnAHRRmde_7kH9T4Pgcufigi-OsZbius2GiiXGo8kIryhL7cI4Q_ACg5V1PHkURnALOeJloBpz4StM2aeMfENTupj7Zu7xiXixsgCEBKc6yni4GSl6nz_NVnNykisBFC5lrEsQdecpAJ8W1GVsBQL40rzntDEflS4u-5UZsmMxBOBYCkVHDxorlxBPUADZm8K_8_uLBYHnsLZE-8mC86efbczpNSGbcywxtNWWxfBqB_WmvdFJSuU4Jt58OkPbocOsy8TV1kB-lQWKpj9JWqMtRysJWVPRqHneYq9bASezc9OLMH0sJstkLL_kzyz8ODRx7Wf2RqCtMI666lNBcFjYWdeg-y3lYkzpXE2V_95r9o2cD-1O48g8Lxmdx0NSNj5w0YkbyaQxINX20mF1GVc9K2O-UHlEi5bpARgHpeDERmMnwmKWhdbWQJqRFqw07G0h-L7S8UL7jSCTauCXRfDQotld5WRfiaB-6qa0wgWi1djVkLnDOCBMTiAQTZR56whCt3grQlKo_RRRfys9gbkRSvOjbfsLhkyQIfagghxuJ395lvEjZP6apFVnsherA-GnDdCIiRUCwLP4srfLhNiww0Alp29Yy78yCwMC0RiU9PXCCFmICOXrp15sQDK0no4XJy7a9eGwkLS9QC3zup-bVuHoMdt5oYOeX8DExLGP9wiSuRhUWDMzvBnog7g118D2MR0h0vccXhiGrkK-IAymC3HGhA=	{"status": "ok", "processed": 6, "added": 6, "updated": 6, "partnerships_created": 0}	2026-09-29 17:01:34.614803
7836834f-044e-4bc5-9aa5-8a1fe2b31412	toptalov	directions	gAAAAABqu-8AkBWLcILDavD55lai83OUA_m4Wf9R9u7aDIp5e_Qi0uS_q4sACp6VkGDok9yWobS25hXoSEZluTKbPXYIYMLS7EfvMZvQx4QPp3PSMcdw7LHSjuqPCZM3ADk4xRC6gJdrc-QRjLzOhKCvT1kgyZK_DT3O-wCY1KYSxzjaMzXMCI8UVm5UvnTjQem2gAr2WQHwmZ6hRu4ALWPCTJSZUMXw9jci5kXR8p_y8qvISreZ4DFSmqowzKBs618GPyf9gpvIA9dVF4jIqL7SMy4GjdWIixyGyksz3Jdx8SSbAvLC4ObyIK6Fmq1IwrrPxTAM9D7nKygulc2qlGaAD_PcLFRTsPP3z0dSgYVgWrTHEwFcNI9p0cMaew9dMYtE4cgnOHf7ZjQPerZc16UdEtd6LYPmxmfZ8vw6-wbUNLmCmxoT6O1CRWGa2GYYbCjXgfnrHwCjaDtcyIWiehTldUanKJ05DpUdzztLKuSzLDo8NvI29Lo2jAkPzQ9nPjoakp2_lRZHpa_XCm3JAtZBNtgC6_mgpAxyPPsesqB6YkHB4h93Qhf5dd4riUuLL6oBrn_bexM3NL-n2ziqAS0k5oTOJh8Lnt6Am4NykySPWnI5FWcuNAeU-qaUrXk7D3dnChbYBrdcnfDFAWrz9kug0ckPJ7aGm7pm05VFNi4_J37gVNSCkMd4V7QQLPhXJg6-6p22k2SSS9KtNfZWAB7vOx2Igp1ScL7kdSKkmizcDHoC2UXIDE9_KG41i4bJ3-3rGvSvIRZPm2aT8ARLBIfIV9WABujVLtg48Uf8cl-8oUSO_6eE99rJcI5tIe6JJWyoJGbG_Pkc7WIcZG2hPD2OjZUf0hoJRRGDbOh1gLCo0Cqs8qfAbmn8nnGfAy0pK34gz_jg9WOkSTYdqY1CVg9lqU_e36RKXjnMXxy4kXgen-jjbGVh8EQsi-SC8dk2WKbQQuxZFdUEx5jymOIMh_E2rFa0DKon6yHKYvK3GzcW0EEDnbreyCnBZdNewE2oQh2z5zQ3vR07duUgW7BNEc6AgRWDGo5On6Kv8OevfnOy94yN2ccrlXvOwS6ron-blfoDn0w9iMfid-vQV2fmu26JBR39p7K5CpPSTTu-a1PLP26hKk-jBbvvrm0AVms1_00l1IYX-35klkRI0AmwIgjFxSgSk5lenZPoLIr-02Nft3asqkrntIlHLTxy5Y_gVRBD5C7seB2U3e62QhwV6fmkgTunfBXbjY3YoCsv4FYfDpEGEw09NJ8HBc2h_Pb8CWJIDhnAi7lkHCtJ0xiHFgl-V_C6HJiSMyA4-7jTeaAKdXk8SxOHN1EUuwAXdKH36ZieaiUeE4S5ax-XZCStAf31yZ_AamQHJSiXhF4s22gGah2M0h2deaKNwc-InwRRjPPH2vZXTA5jLTlP1VbANPpSew6uc5qQ7667Y5VGprsG6xuFcRkD84oOc5cIcffnZpY-Ead6gtmdfcPlZPzp8mXoRPp8vSJHvOxrudW6U4iTtKvLykh--nk=	{"status": "ok", "processed": 5, "added": 0, "updated": 0, "partnerships_created": 0}	2026-09-29 17:01:52.483191
f146a744-aedc-43b3-9e6d-96f4dcec0481	toptalov	institutions	gAAAAABqu-8OMTSDzhDqTGe3IJNKHtWYpk7DpKloHSteIWT3LfmoCHVpT9eLGrHa_HapW_WXDAJ4bqixFhgVsuGU1VeIMgibNTPRYQOehG2SaRJ04TnVnyw8Zs7msc7jgZT-nM2ng_7QrpNq_QKbOHgGggakKIVq-XaZL5A7WZePnc6ReUKD0AWm52d92IAsDm9nVHJNdakjO-1IcKA05KCA8Ec67u_ESY30gpl9wGX-9q_dc9HctdFk8H00Cqa7bmtlF2NqyQMv0xdOJiHmbIP5VYCtaos3az1hhaYZLgEU1dr5k4GNcQBS9KwtELBqieCXVJ107MfSQl0hkAH59uGgpqIjK0Z1J-rpmHpnS-aEH0aDW5ojuiJxRtyPM0DtVyZrgE3F4FgJVQBYUmHFiWAs55x18ZjM7Dgc0XOCRUUFj55TQmmtwDkmyUF8bHwNiChGsFv2yfmZzIG5mk3VoPF3UBt1DjC8KXdbTkoLStWgAFHUAvXR--yVD2FsYZUmJMMgGpq-M1H17y_W-yP5hzCnNgLoAGdqcRVrzZifC8Ggz6FMHhfitioVy3Lpqr0PWs_4iQOnOkvrCuYWckr5qSIVYYUSacx_zPQvSAGI_2hvTto-ASVRqIxXgWeI5okDduNbUra7rChvCEsFW1ULmw7V-Y6HKELHFS2SY0LYZS4L-1cXgANXqqKOc0tfCdQGYpS1oFT6-787KjazRKWbtcuk0Vb1RcCY0jcg_LhNjiImkbPKf-bHNh-0dWRbUkhS5qiO405BLc-cBINPZEV6ikD25s9kdM3IpDnMt1ueJ67LMl8W85GJvk-HIh5NO5l6oYNNskynOQMG5d6UVt3yrVfXNaZ0HSkDB54-0ASlZiphi-CK6Dsx-w6aWmsXRG6N7MGq1wI4aqR0CtBkb0d7u83-ht-EbageBPJhvgYlnEgs8qbl4Ly77zyBXpLYywFcwHy7MXM09MqaVgwRV79xacykOQ7eH_ttTORGKbR4faluRvcJzMKPSzrc826psmYoaxnLicVr6cGOyuU_bcyfJXiDzhzW5_dVSnZEq8cKKaAw1bDTCBqqQkREzPHsNILbkRIy7EXZ1TAHPegioXMLQQWwUoYqJXpWMr6E9PCjjwYRWY8N2fDTUHt3qfjq5VA7m_AZQhQe2vRR5t8LIydpVPC2IAe8qAjxOCacvBuVtyf3-Osz9tTBPYyprSoIBPQqzDTH3Wk2cpexpxHAb84CdTDB81SwOJSc9FwC_BjuePN6kHomIdkQwyqOcMEFnACZ87l8duci3XcJbSLkypFc-mi0gfjl_NM4Z7E-BB8N1YsUO7MVco5LwTic5hO8msM6VRc-DoY34i8NocEK4u3MrJFM9jEVQEHmLLRY0jzIWP6UEBfLxzlvlI77yQF94-IwMLQoF4rQPOJ6GHvAleOy45Axp5x-7GFzDvKHggWyxloPA5V8ImFejS4=	{"status": "ok", "processed": 6, "added": 0, "updated": 0, "partnerships_created": 0}	2026-09-29 17:02:06.634802
4558ee72-4d88-4832-8f69-a027c4173529	toptalov	interactions	gAAAAABqu-_4VekF7LyDGmg4ZpAh9Q9BaXorcKfQNno2ejtObGBb3FctTvO92vMAqnQPFXekVKR5x_wUOAiVJUoybiAhIFowel3ad_O5prg3c3QC6yqg_Y_1fI2UvpTsEhGP1uVpeC3bQxN33fyM2OkzwpfmmFP6yO6zHGVe6DmPcZQz6QN-iBL6JUYBP_EYjP6P9XKbybDJah6rWbR4YsqdBRAUXAPrupJjZCBskdR3AfBwv8pW2xv_DFF6UgB5VdDKb403svYTA6VvdLg8WV70vwfx19In0VzAMhEu8AwbgefKcS17TAbgCpPN27YkUCJoPNleiEvPrapNr6Mi26D-2zdUMta9DJ6BMypK3dmMJD6x3Sqa_qFn8hy4EOQZ_nrzgWknIJ733yAQ2x7TrOF2brhdc-2CAuuMhIB-tCs9Ny9QWzgrUIb3xi7QJNE1U3qkNR86wSZ8fY0qcv2MJCE8GHFXo9IgkgkUDc55B2YdcDlPqggqE8C3v7E5bnfzIOiqRhkLsAIihCe0lJs-goy7X1Ot4wN5kw6YW1BnCogCIj4hOWB3TDWyWxAKtAidaSBHTNxyQsbtlAAYQiv3yqUQ-hRF6mT1T7Ze4T4u8XtVZVA8YFZlELzm1auZk-wvFxXQQgT8_XcCzl4o3X-DLU1Aa5uYKrmVnYS-D9ROsLrKRSWs8DNizDAbBAubCTn3bQKYupI0W9qymyTtYLA2SJzBoM6k5fmrG5rxTAIjjZ-wOqXtz4nfJ9mVMTWYf28cWGVybTOKxYsCDPOXT0DNg8ZNHAsc-v_r0mx8kjhOrVO3qg4Etxjy-e0jxZ--rRMxFVg4NooRjvAg9p7rcBUjXPiUz0TJRP05uNlov8rGP2hST4YoMwpGqTU5ZFZweY29RUER2tVCDmfkhtOIhnN9dR7I7soD-qJNuyNJQexLEcJ3a3bYanM5GKm-IRUpWWctakTFTUBd-FNNzM0u6OU11rSa5zeGAn93wH5jbeqwpCOx-JpK2QXkRuJWy6Ia8BWmYIJ8q1IPq_3eaCW4tkUcLjhxg-pu-Xeu0NOkgipD7HE3Lh5DmsHuNxd9c071Vto_rbWntWYMRGPIMrDMo-JlYI-G97x675cDYJdNZVAPdg-zcLbcjj7PhG2rFtm-EeN3GtLimrSk93ebm0SrzJFhFYEiXKPv125v1FVfIYaP-sdro9s_79RRd4QMQuxN_bOeNy8IpAb1D7icaxUynzUo2FDZYwGwD6DQ5kXEsT3P7jm-RCjP5Wxu_zWQJEgBCyhTENS6ZRQffe9F_yG1PUQXBiCFP2Ou_YdOea9MzuRFV_m9JGEye16JUSwKJFu1bBzWuu0f_uxEeHh3uUaxBAIn8S1l1XG_2iqhRp55N2n63dhcu7tziXSIAu9ZJOmz_f9c5Cjq88svJdDzD14YjY680gmxdwZmB3LPWJWSTBs-6fkzB-XnTsUuHXaxloqbMyT54WAuvoDtNqo5Uh_lLHdH87mVhFatD3qogzgdk9JHcnBqFSIbfptR3V-cnbYXgMxpbMZV7_HWmoh3PRiqSiLEdpH1ahCNPidDaluGtyS2z-bzBaBdMMD36fQPzThn5a2aJ3iuhlNRuoUSyebxykU2Y_9EqXEh0QHafRea4HwHCTyIy8NWjFdgb-D8CR9gH3oWDdTvTWev8zE-r2WN5T-yGhKOYMvAaN7T9Sr4ENmqjp13lIQZ2Xj5mX1JHEjJWFE0OVnpg4XmZjI_D13xMFfuv7g21HJrgVyERGpa3QrDcv9ro5vdliweflTlRI2NmOQxAJ9aO3NilJ5OUEcxlGYntxvlG1AA8yjJwO2Hcy3xXP_CDp0uID_m3rOWn19x7VXlf-jIiXZVxJwikhRj5wMKgpFwdzklhGTKL5qhH9JfQrOJVPUgmMHx3LP_Xw6OD02IDir2XHqz4rI28pgUaphHCoO11OpomUTO-zdqnZsfmffiYMhU_Zo7c8FwEy71-POKapWKiF9O0cGEHEgt-5BjRYtuYzMZ9x7sl50x7Zb7GuQsPYl-QJKHhVW6r50hb_x56pWpS1XNtY9tvOsPXtcUqlSYr6rZw-1-03AlCGGKVMSGZC0w1ul6zEPjgp7f6B1q1FRm3q1GMrws-nE9qACzrlMGJIjXaxs_Sf2tDB0PQUM5DjtdHbf7CoKJKys_LUsEIN9a8U4Vjns48TDX9Ml7PIIihRsn7_hmRkHkI-kCadHTWuIj0ULHcnf-8aspsd2UtFb0-VFD6XjosTgvT1egp1jqB6vzdorfwphM80GMJlIEku303AEZAGRDGYTTWo2CW4i4jF6CsN45TzVonYW7ayh52j0eGxm92DmgRDVGaHUMUI-rDh6focSKlZxiK8myFm59FWZtbaILq8Vh_SnSGZyJ1-El1AKak0tDJN192MnJKUlChaqNrcWZWOibvhAYeAI_ZQCXDXWsDqVrRqvrhBK6hf--9jEWCn83A9zojum03oAzO6sDH-Pu2hgouVArkIlXg84tDXFbxyMGrR0pVcv1_HZ0OUPsMHzthfm0V8JwZlteDQQykWEW7dxQ8ElsVHIFcVQKYdnkoy4vBfSKn2MOAhDZSf7HYV-LAd3HHLRmWRcoYdc25sYWk4Pl2QcCgryX5QFFv24f5CXq3oLkbn_Iompr6IlKIFa0ZPoqyidEiVdJ_d51LmxfUR52OOXQJ-b1L6destrpXpkFAqGAxmlACkQfbP6R2NgySWwTITe5B8BbSlHCYGuFKeUjiCmo7Yg7nMB-giNeZFmzrLMGsKSnUu-bkxVRkqhV9TgkrN4no0gTfzdglHSQdo92x3GXLGSfKZt2FrRls2xMv76PtdyEjQKwZ4Q4zHnaoxqeRLF9bztPnhf9bfPVHumbY0GTVLge9Q5Y-aszo7xv3NuNn0rz1GzUp4uIC9_pfa81ncX9aPxMwpWjedOY1SiRpS5wcVIiA3rb3Ls5yHRIPHYI-rzRo6fKUpnzcrYIl2_08WCpKiCPDt-hxfY3yIP9PbBMz3z47PEe-k-n4bKJ0fHzj-DKqQxLxljGKCNQnAUZUHWj93N2LX_A6bald9GxTkyktQfz0pmaJjyJbV4nB2JIlfbYYZUWBdUExW22UIBq5MJhhq1BbXtrfYd0cHOYQxojoKfbT0eSlPJezaubAxDiOVLYZBK2sm8iNAdlfI_7SWHkPWYZKsxWGDU6nz7fTu_SSNVPWNHD2egLV6ZybEha0ZLd-WPQoCSHIwNUnKkyLr-Lj9FPmhBP-5JyQR1t2r6VNhhuqatg7BLT-tVdlcMG-KKiGG4J_Ljopy6iEPaCAvfySOk17Rky3OLN_6Tz4KFKLydFo9ow8AKZm7tH1u6in_MYp67RAvc_RzDc3auFYuwbi50KlxPh5CAAyFglB-DnlC9D6s7LWvhhQiBeJENl47IXNzgaC8basWWuQdTTX-rHdGkgi1vP6-YCP_PfM-yyW9Nln4qCFOscUE0GgVhF4oDFDvdbb7diIyHhnnwWbz5RGTZGgC3tWiZrfvBNptLCrnUDNPy8t1IRF8eOZpXhp2536EFovQEcrgd3YMcvZ99SDI6Ai1WEtzOm7HnvXcQQb_tZQFpMsbw7tPtmrFqr4gZjh2lPapw10gJZ8OT6xuPj7ZNKLuVnaJwMZbv43naw4tXPkvh-iKyZARAnPGJ7SlMheFOpEi-iczT5lUFwJm0YCx7nHV-T6Zu8pVSLjVsrRm4f_uT_1MkPl7c979rPqAs5qve9OwVgcLeY6GbXGbtTbOomXpwhrJiebp4Sm9_kexEHUTbIialWPAQCaKEilq_KMU6OTVGXl7husTe6iAtstAUn_i_7xfZnizLeQhtNbmKOr7QRKE1DzNIpXUrIeVVFSAyIUYA24J4NWevi2-y5iIynAEnMMNMLm9XdreElwSyfT13SfEukW_oDX-Kq1T9StCP8mjFbBeWrZz2hSmnmqU8mz445B8D1MHiWPpTzcdkFn8o0oqyiMXAiWtp6Pq_3mfjBO84lYiK7KIfEP7uTdo09xIij7OlzieQPeLb7oAcYRPDnYAG18A1krRrwJJHK3jhXUhQ0NU_eG9J_PtKeJBq_Z9FCcETaxoB5cgp2ydUurM-VMlL18EpDNSJ8jjMNMY6jz_trKUn6rw6ndSyYOK2qRzwR28mb3hyVm0E1JtlvWxyCS6dbR_Au2Gexa-Ri5F1eXOPlSNZP1ckDZjIofIZQ1ewEKEJOGrXpjkHpeSsqFxv2aQ_ZCtsWrOOHx7u18Nb9RBeJZVzRkOgwjYn1oQfWMvcFnI1q_R2ENvB8B7-lS-OKv2syC2Mbs3m4WSpqPgXBJln5FvmgP59tDP4WeEondYpy9W5Sn_NoFU_KB2T8zQqePL1COW4H6g2hl6nGTUn5Elo5qw8AYrL6DFNTUkHguAi0xX_aloXHOQAtKjFC6EkNm_WlUrsLcV99buw74KPpxH9radDSdwkuVcvhQPbyq-pUKdi88H4xW9JNdwVNEBmNxk0AZbk8wA5GLMdwXxxy0xeLrBmq3nqHr4sRq33-d5WpmCrFl4LN86HPKdvarvjCILSvlftILQ-KboRbU0CdMLsyLQp4Iz_L7sM42qAJf5Jcgm0q4_DZM3EOHV4j1G6gWljD50Mv3dk5toDRBXyRx6ZMMOkHWs2Bs47aaYy71FFm4i59gDUdsYwXJ2qh0qucmbV05VJe_x4Zsy9umrKS014KEPadH3TCi7AE9402gbz_xEL0fuS4f2HEb842eMw0Vt4IUzNzaWFoGkGSm0q4-_m14La1UYj3yulHdvUTRl76VNHblOYgTof5BskFSrSq2UQgCh_7uxunZN5bLDHCPSy1s39JyoDye2pBt7536XnQdLlSd7Qy8JvdVOowRhQT2i-PwPdIJ51_smX52giJDuSIcMCBZLiM3dmDRI2-4mq5fqwkj2jPEJgmBLWoYlc1fb8s9XEtxxgiNSpaqHsZc6cKmzgIi2eEvVED-uXd6P-sGRFILItiZt-pJTjf7Hrqv0nVWVL1USzyTpeFcpx1oHSLl9wGnyR442C26WS49NMMy7DpjigPvF9GG8D3VHwfJur-Dlyn4q6MnpImgTQ5tg646eRn_7uLH-dc3sCzAMUMD8hdcK6F7MbNIHOpHy31fcSKkRMuvkIQNqWWNsRI3wIGFP4d15-Ri96ekO-Nn7zfRn2cywlZuD07eINBt9vNGjGYWqQ9uKFgI5nYW-HXaTxJG9c6-v0ikhqvJ0oiEoVKpJKBm27lWSVgial5d7eh_Rcw44Gqh6DpghIb4oIPhDv9DBIS1zNm-tWbU2tj1n_1dJ61d_oSb0BkK2cimc7sYy62TpxkcHPWmiwlCQEYmguyNmsYf71ar-XceU312_NUPbNzjETPbwtck9lbsVK_hOm5AreeYqdz-MZdUPvYxm4VoKu68_8ljBhMPXFjzNbQJUGJpM0rcCiUYG_nOr1GCkLYO4CLWMPW-zBgP-I-KRUV_5oyoDTTQrHyjVxy0gDXgnjptd13GFyrl5WbK7oNGcemOiOFOPWuvQGBqJTezywiOQ93gIn4MGjeTt876ciZGAqVTEG_IkHG6ZrccntLNYpmjb8Jruvhrph_VVgOQdnSY-_xQFMsAicBSQ-atFlBrQ3ewwBTv8JK5RNRlfrMqLTVgZlipOihVU89wKuoaEIsDCwdjDgtcjZTw8bEi-zcYfm7LRZ3uFwnzOW9VSHbsiUn7S7IjusZSDFrt30Sj9qMLFal6XOgf4wQlmuz-e9KcY0blLmxkqG4J1--DQPR5pGn5_i9Yxh8zQ1uXT34S0N7YVY7EIhucokvqx1R36IBScjEFVdR0rl30_mgpumuzcq7HuJ9Vup9hoWFs3h15SNZMWgvrbKcYC1UsbOkJbvC-A5xlhB0RPCrGAs0aZUS2_iYtLJEHbR23KQqsosqC-hRIOhj4228YNkrDSiOYFMCf_rjEYaLI_t3NUH_v9E9z5_ro3SgryOlxvFYQHcS50AjAjJuASG_kH7IarjxUZRLuhZR2937GeakZ_DgAK98MiimgbIOsEYlgQDxdpTsw4clTtTD1d_opUqHhjt4pFg0Q3I626fzbC39NqPfcQu_ZbIFzRtZZSLD4w_Kjx60bR1cWPWICl2YRl6v3zg1AdIDRvTJRzy7jYrmFEEW8FrJjEH7vrTHdhaBQaH9hccQkewdFJHSlf1ofgY1VH-i-AWwaQI=	{"status": "ok", "processed": 6, "added": 9, "updated": 0, "partnerships_created": 0}	2026-09-29 17:06:00.256672
1a6ca8c4-d529-4c87-a26e-e745ddf733de	toptalov	directions	gAAAAABqu_AsJ5MT_X6B-M47xcr-ATuU9BgdgD_fhohJ_Ks9DAB0RksI4M0cDPQ2NP_uEpIK_MYASaFMk8HFVR8FBWgifa737yQqO-6zLFFcsrBWX1Dy1JvqcgCQJUUMSFer7Rwde-Swaf21FrsuvUPdK455e6aLuxa31d2pnRF7JEMVvSnDplunfooRbGoUrzpiiOFSJYwCM0RF2WXNkEjt06fP3vYyiVxv0V2aBeqZQg-aUrbUVZ2-rOHwW8c-NEHNZXkdmuIIUh40TuOLgM0Tuq5CEbD7HqTQYY0h5zpzwE9BOCrq2YMNDFtnKI48kRswkAGuKxlZ-3IuGiLaUomqDjEsIpA_M9TqBmSR035ShfHeiuZX5vSEgO-hjrpLeR9fTiDh6qbSWQgatkr0Sfd-aApAPp88ipLsim5Z32piNkYr_bRbj1R9mQuw1p-FA4XWqts-gwbU86pAqf_5YCsLTH87Pz0us45wcOW4acEFglyXHjO74Bxptxz5EMleZVBOLyEz2Qr0vSgn8SSwo9oXMOEK5LqtG2fx7HhYQff73GIR4OtyH9oCDJ6sTlgYgxYbymSI87aXakkGPISfomNwTdJ2v8AAAfVkdSTvc4VtSRpiJMwseFK_QGO9zO8_Abxf-kOi_QmeL5Ww82GDD8tTT-bj0HHdKCiLvLKt4XD5JfQPci2XbLtP0gUiVfmXb85CQPvKlkEogRNlk-B-NKi6rgwdxvjPuHgPAyvy4hniUlFEjyvP4WTXYj2zJN1UkkQXhAb3X9zeDLE-qQH-kDN_dlUolXE3ZpVV1sdrTagOsXE6e9S26_QrDNPTX4KfVTquOgivQeVge8voXdD27aFs6WtcC3OXpNBKkpspnPrP63CwTsVLg2yRBIMJabj97f_68TkTnANNNf4O4nt49ixRk0k0wONPHcKe2EzVmrvap-43_z-xy4k_rrD6wsDYuaqoVhAv1w0c2qKGfy9pGEyqcwinGBj-HsromJWowr3UhLOlgQtnPxrqY2dgwCIOVN4H2OasUTM9jVPAFt4EmG3ZLisM52_UuRzWtB0LWN0NAK7M7Jxr-4wZ-FXeqZqQI1_wS02LUDysblfVgi5CyjMUnWa9dc_RBuDgP9GxWKR69gM_xxF8qvrUCaf0JQFAqnjJuMofgQ0uE1sk_NWhEiKbR6h0qjLTz34ECzzVnUDk-oPbSxRFwjnOMw9BBAXlYH_h6zHhHNlzb-GKTiKIJ_4lFC_9X16Mddm5P3_aRMY4qu8uPLsb8m0c7xapSPpIjuKwoYVkGOjFNzQXhDk7vA_4KTv6P_ZAX0ZUWNX_O-mUiRrhQLq7njckI-UrSWObNTJWNA7q1LKTZHEiXvelhR69GqM_nEEgood0uqCcGEGpFA_xse_q1lHu5f3kd__lDwTLMpbxD9avWoIYR32sZC122KytC-M-m4WGcpQQ8J9j3NIh_TK4CiywDR1tUNKOv72_KndoInyj62uHobD76-56KdwW5vGLif5hasVWdjDudeIeB2jZivQ=	{"status": "ok", "processed": 5, "added": 5, "updated": 0, "partnerships_created": 0}	2026-09-29 17:06:52.186731
1abf164f-edc0-4d89-870e-f47806e8b833	toptalov	institutions	gAAAAABqu_A2jC-msLLUnvJPPmzIZFPD0ywjWMioS2SAQOVlEL_nmWc0Gob2VfxUbn2WvsolKWKTZaQR03GzikUunA9J6O8tnDyLmiubuKKvvGxQ9Xgc5b72cDe0MQ1fFuY-c2tvRECDZkmvT1VP51I3aSCEJR_p6xA-f_DtThz_OSmnIr__0G9aPHI_nnjTI0Gbr4fxYuVBL7JOyfB5qtm42kG_wl65Wz8gFv5d1HbzdRKFEyi_Tei2o-cDeReGgQcKhy4sYXKRpJPsRE-6cCZUkCxXKt2zgPz5QNxGpU9lhHm2xM4mbINZtt9UZc6aGCZkQpUkxq2LWrARBxy5rAhYi440gaEBQEk6YNzJjnkOQxxci8iMvDtMaMaBQXBCkDFQebXabtSccftI-AuRFTHLeHfQebBlYauGkGV_9Q-d5KTBcBXrqgtfJMyJqGvip5qe8nvY4pz8MWiyL6JX53s4-meDZZ1dem4snhbWc2iBALzVvvZDpZGfObzbE2-QNHiLgykUJRtztXZd6nJp1QJCbT6kn4g4-AAW_aT582rQu0jEzmDWMAMovgjKFSwV0CC3cSRmMfw0KZ_LxFySTTEtLlQhQqlYoOStKExprS-FZfgIMiIE3YmYY1hi_wAEcUM1FF_sBrwBfNJNMsYrSCQTOWgg5vbmn5OGtzmDxGIQ2gF3HVSF8JCaAkWbzczDouMP7aY3gg48-eWPhxELzPFoYxu-AWP7PWA6QxpuyRM-D5EQsJRriQKrRVTdsFlftF8sEz9jWHX1y-rP-HJW_MIvcVMfFVk-5hhRRi2qsUx8YWVHY9Cr6PozA4AQN_Fczdft9puG6APFrdRJ6qJe_ghCZJmaPxD0C03dQffb7maCl8qVTfxOuLcIBpFMqL2A5EMglo_P9VNY4KADjJVH6UZArjQX0qkQvSeYbA8DCl13_aSzs8ru9Hl3pl7N1mdac7QJVSKBvWoStvca5QXAWKumAmrOQvtxneWjNTE6eL5YI4KnbzwiyBLuw7ybOrV5U8seOi5jVKVeNgPvXLnc5k0u6AY7DcCe6OqM0iaiYez1dQBE73IHSrrhbXF9bJ7CzdDtZJsQxKC8Vzw1JZmeKmT0cNRaoSePKQxRRWkGIhlGz25peaeExy7OsQPy9zXMx1zfPqpez0L_Oui8Pl4BZQ76A08OO1N9kh_s5xqfp5ngWHalcuRYNJYIKfWkGoPDXkkWPyqCzs8qj5xCoEwIX0rbTbUv3IuyKPlWsh3XziHrNhtPxBd0SvG9mb4scwTTNoCcdJrc52_6mimz6qoySgvkoVB-Dc9z1dYyCVpU_ZKoFgVYsxCNf-V3n-e6d5yVUMn5npq2t0ukG6SHD71NAzvYq3Yy4xEQ90oE7stfG_jSu6P-rtV2OVTd8CgC79IWMefa2Z2r-s7lZzRYt7pEofyGjxuuyYA-PN_JRlx1HaROOqPd8efcQ30=	{"status": "ok", "processed": 6, "added": 0, "updated": 6, "partnerships_created": 0}	2026-09-29 17:07:02.189385
5cc1f049-7974-4c19-8323-bee2cedddcba	toptalov	students	gAAAAABqu_T5R0t-_099YmZbT8lQ1eba2egBEQtqdcGhGBJrSQFn2sRar72IzYPZsx1ZDgjWlOFu1jKcnNlocCKziL5MUW9qSM2x6_9gu9Kq10akURRpcwMfRuPIZv-5gxTkou4kAkqH93tlJuoehCoh5ep2VYe9YjbSLKwk26m8YZHFDQG-wFM0SJe5lqOBpRhdRAZOjlNZQQXfa8p_2N0EQuTM31MF6Jep-lefDtngvvIzs20fEIGFnCzyf7_gEXEqAWr8WE6GPsgP34Aoz1dwYzkUzkMNbzG_RcLBkcQzgiIV5pcQWvHRRMVNSN4zPjZmyrDEMSCpkuzH-nWpbQijgZgjYwRDiaO6BQv5sp8lz2bCOI3CyG5ymFmyaIb098B2jBMEyzLa5uqOQHGSKskjOfr_UdvtH1-TNlYJmokeLVj03HKCtvE8XwixKD7zlqnlfYwBEqcpLuoriqNpnh21F-cj7RwbBcyzckv1b590zMGVM7FwyUYZ1zSuV5tqtQw75IJ5-drDHUq4BqHyopQKDxdoAAB3JqE5rNSEc4_aOYLeJzYdXmjPCXVbObrYjLozChAAls3K138-zqxjyrW_CFJBjaV4ss269D7lbMoonAD-yNKu34LLHZdR1yBmmvHjyMx5WxOJuvPPhjc1noVBF0_8DEznLgVumruNaa4TPp5GFzblZNPYp6MafhYVHFVjqhZ-w49xPCnf69RytsQn9MhpKpYNmrZ8Rkzxv9QubM0G3VRCStRJRWPUEEXwxBQWi4qoDD0CyECiPb7mdUr0jdDIch3I9VbDYuvNQ2RrKq_l9zRoCZh0gU4RemSl1V3dOqPtpmBfcd5rg19nkDM2S4fjg4EBMsFlUboJOLEjiqvaVHTwaLYgJxEuha-vV6Mqc2i0c4RIKTKUVs8H9mSLvz3xoaFBhIO412CDtkb0hZCJ3zivus4ifneG7IjYggpD9xyeovtSkkragKrwIPKi8hh7cw8kPztw-9QMZVMNkv8yBMsbipP0RaPRdvFCvP8z6LoYT6uw8fytKmbt1lyRalvd2N01SzT7_E_fl8rtOguHdNDpCGw5gwPnefE7zlGLdPIGBRTMZJ2YH5bbElyxHeUzx2PwpQ==	{"status": "ok", "processed": 6, "added": 6, "updated": 0, "partnerships_created": 0}	2026-09-29 17:27:21.365196
b79c49c2-bbcd-4aae-8545-ffeaa0af079e	toptalov	interactions	gAAAAABqvAfFj-wU0PGZu874VBghQr4DMYDz09JjesaVs74EkEk7LtZUgYLfTVO37mq2huIUWdDzGFyA34E1t67JgqKB7JD4CMopEy7emE-b3U8IR6_jZw6H9vXey6GaAw6tn2m2TimrSLZpmuf7pF3CMaqjNTdCWzjMidMQZnKCEjINYZTYBObqcrwiLfHoqyHV-N2K98y4dm90DeEtEOA6M_bg3K43TliY4rR72Du6b4ARbvbbICY7TDgiEOU2fmFfafMza5XGt0Ydzk40PArGz42N23X1h1SSpeH7X8Ox89eEAO9VWAzpr39HuayB_PuEbSwNSAazTcGoaZaTLgY4_au1ro_niS20mfXsEmpjW5arr8pQeFNdsO1t5JQZFl8IZQe0cYrxxfGWqNUMTE4jQ_8rGGYEqKujzQmS9urSqO5HMsdt1nl9WCdkEgVZRFULgezCdutQNPEir63ehP-SmUjta3ddHPKyXRarXgyIzBTpdXZ-PIzoLmPdmFsoqtECD4N-t7V_s8iSNaiT3giHkvfV2ZcVxQxMAD3P2GT6-VazUfqRxXF0_8UY6ob9NMAwdlRI8XMWoFJgT5S28TSlHXxcaerHXbA4DTHFN0J5xETfYVZ4BFs7pEtVxWHkBoVfggbuSLqqv7jHS-6ZVqVbfOPW37VIQRykMKPLtM6M_UxYW5eRK82WhPRd3pPe-f4abPPMSWbW751UJoodIDr-5MgFzK88A6Ez9EuFfvLnFZRVd3ZRrIFsjyma0LMkmPe_Wt5KIb82Amh4oW56fWcU9JvVL2P3LwcjPjjkjJH8oZoAp_3tvLNTu3xR32Y-p_03rwqByaCBUsAVF_3Z0bYT1nBjOGahf18n_OaVRW8GCZBZir_IBHaWMtMjPyESIkAjaQo-Hvx6kASEfgUhB5fBIHZXaROIAO16iJ3SALNDb9x5SQpLZANZoOAqxI--WeLF6V42k9NtOUwHgl_ptZ5QU3yenDyR_hsbsJtr0mf_ED6DD1rPLlsn3c0En0tyHMyMLAWyv6_7VUaDfPfZZgxVG0RrMDxZfyhzTlkmX8-3eq-3t-xpfNPGqKZO6jdfjjEPEaHHPlwULt0l1fg9vKBv2aAe-aKb66P4fCY3yEAZeb_XhL6ItiTWmxHiAR5VGH8B6FLBjjnuYJPGdcIUeoTWT5Q6kX1hUnYB3OnbvADRHObkBbqKARG0vkJc_YJA1nKspHRlyY-A_R2g49MVgV4duF1Dt5NqVx0gk5BdOoTgryXRBGIAl4wwqlGut9pGNR_DMN1ksSNwcTGOKRRPvBafFm5TMW78L5ygwLM8l2T22FauygAyyBtCuuWJehQsRyVb2KMnmDRVL0-bvIiXSkTDGgtGYtAlWOExN4jI9Be1o0e9Zvc055mxlWOXP8khesJNqQgysT369W4KMYr3CTuLAh4eczgoKivIxs01D9TlxsS7THI_OkH-_dlB8rFqu-zkv0jRcBx8aJObTgrz7abZZ1u2kF-_iJe47GyVMhvAk4_lO-VlxJ170dYKgq27AMwKoibJ-qQM31TmrJmCZ2poBezk3JU0rwe7BrYXVYM8hJD_83qCftV5kHpuVLxgYlXd8Soifzt5Wsm0fAXfiJMnw-1BNggRYGRBPqoLWDc5wdgoEKBcmhgfuUEHVr3M5baQbp1p80TccGZ2CRuSInCAEmIp0hWgTZPTFGnNHLwLdHElSbYfptigy9gKAETRj6BF6nz_vyABOYxmF_n-I8rch68m5Rnwp72UwAXQlHoEhob5eSQg9f-ayFjsFk3oYS3BVD-Wk8Hig7V-GCs9Nk6PV6UscVcE3TQPxqP_LlevLuU7b9BMq27rhovZ2uAt3MmLb6cXqOKKqvBfXUs6yxJ-RtZZH9JKvJ0q9Agvp1wzJCbcj1ZNSU8tW9qm7Os7MCRXd9GsFeUJD1Cvig6v__jENnTiU-rXNwj6jQil52QtWxhQ9ZGCR0_fulO5P6ZE9nJtYzPPaTTnj9r5VVCjSGFn5C_VPC1nyMV1NW5x8H8-h-5TxhIgpuF-z5ApFRMKP9jRRX4dmM-8NuXsEUh3q6135sU4OIZo3s4qqno-0n_mpBmckVL0sr3bpX5esPS_9u_NAHK-LrpuYuGtx_exoZb9y44IBv42o45oci1gy83CLH0vygHplCDU6PhJsApe7DhD2hu8K8MOI1qt-hp44E4KKriSwq1ZkxFMXqMZVNF1hWTVSFF9bCDKzS3NMBhwy-2nZtW5XZK8z-Pf4MZHwxqdTcwwTNJFjoUapW1cvQHG06Ow_gS_8MNEYdMsFcc_GmIiMMzxhridJFCfjGy-mlNDYrC5sxH-93no1BrLwJavbuwWoMctXtCZtMQY3w64_ISggRD5-E0VPv9mhegFuATZw93aKRwevrkKcQ8bTu_4Ox3UwbRDYRTlZsGH4k_feqIQiCHmvkn3fXon2IqKGuPwy6YebEVgvmKgt8TCMjd4Hf9GYtH29pPrkDyunjd7eoYpoV4lOk4F4rskA0ZOTw3oUlYmO_Yfqy1Yar1itIcChz-0Pd75wx94phatiRvEqeJ13N2qh5DkA-GfuupAJYLml4TgiQR1DmFo40IjJ-zi7mDpmBdxob06JqSTY3ZdWH7BkDXKvT9qn9oOSCmlVO18w-pLk9hGyoch3-AW6KNYxhczQA-49kxcJqr2vMqC-v3qt3f-TZasg3RAtX2ZykosImbstN_bsWkRtJV7Yk5oczer7LO2K6F6W_eUIpHlcv8cYY0ck3SPKrqTEd2htkx_4AwzhdVuBQdW9ls3vhrxQKmqHQPgxw5Bsy_pFaMD85iCNLItFlwjCAh9JaHwU-YLsXLV4fNZkZdldt1nnlLkR5BQZsU1Ca9pfiOjl2FzrSc-3rUWNZg9rsx_siXFVrdsP800Q1WHbP5W3T74b3jEKu6bYZMFzTlz0z1si3fMb41WHGxnobsPKbNtdHEaOgDMDLYUauyBJ3oGm9wjYHLmZ4YeiVdq4qi1dkZi64UnXC3Wzzm1OQ3k01sfDG-NLf2t0IpH-5j1MgpZ2CorAe6F7EQiREhGE-DC06m585Nop1OY6Ky-2xLSgxYTfrlLtrulbYvr9eldDhXxBbTiEd967oPsTCqT__xWJAfI0DJLQdMk7UcydX1BeBSCyQeEh0ppIFD0L66XFEimQ60mux_1Vd6l__K1dE7XHc5dY_2TIjfU7QyxWeglh3fpIb44NZLO4Um9MXL3zDypJtPJVjXxtRZ84Fi7Iboh5C7-k6TzOmkGvcuzyPZGmjJwwFj2i-HAmRzcy5kQ_FFX4d_epg1UeldY_5PNHwpw8da-t3FnYJMicb4GcUptM-EfwNaiN5w5BhPPByEosf41VkyFnGYaZLdPjfYSPB-fCcskUtPcxOhdguIeaduvJ6G2GQhp7WKcQeAvDdG4Q6r2mQgG_xBNTkWrIdw4Gr3aJflrIHxuZxX-op4cL7gxGw1V-3i3A12FK5CoGzJSZDyJG82lak98PscnXE2O7QAr4guFWStJOQLcbGh2z5uH5VyeMr3LgB4jASYoLhgNcKk71qr6y0IZ_u6N1nMnkR6Ma73fhWCTUoTWn9JOvLc7UAXvyIPUEHwOWAV1mZ25F26_bfcnBDSrjSxkf6NEywdva0kOjJT4HaQujfKeG_KHjENn-JHBbn4sonaHmgH_iZnh0eC2Ot4SieIYwuY3DpIrfJY2a8YpGas4ytJOZ8ws4fBE98y7oTRiO4gqtlfPg_Ml0Id1NfSLxEcwVhV4knnmWyupluin5J4mAhHqWkOQK-6Ldq3c483UzJwmMq5WnxiqJuQKaqe0sfdok-IDvXmKDtF2yOW32LG8x8Q7FS-ZTB2oPbjF7fxur8A4oeLdz6Q-82xkX1J8w_ROQJMO5Lsv-XGQj1ILA7xNtEeVA6FKJpQQ2e2MX2_Wn70Q9rPkWTDNTDbLoOcVGOtKVHWwj3jdmsPVaYmIZQs77_-vcfGg7zI4Z9nzIYMKSjmz8NERtvN3QlAb0PvgPhRNKF8TJyCJnGqeVxKIFxG2DSZY9YI7gtgyuNYEKV31gVlZe9M9csaxUUNKzRAqY-ADB04VegdpIzHxwe9OYZ6Buo3oQcs5rl1emLSz6JvAqCCr8NyCxHZAOejtZaZ6Ee1it21WO5go7ERQeMscb74l2NDzN2n-vUXhWlFlHf8pCOsDWQr4Ebk0TROEzNiFlQUSWkyH-17HAsyvvDFcKFWhN4rWIp7yFDRgjReoFtsaKx_OpOMZyf4lgTGugo7EMlhk34rUQu5qndRIsodxvJVk8ZxtZ3exSl_8zmROAmVGWoSS9AjwMbSYqEuOUkuIDkhEgyYmd54q-o6bqZF7gx0NbFSXlXWwVWj1JkmYDdBe6d-mIe9Ue6bLVI-yRgRZ8omLBffzXABC3LPbpY63XyjHja85nLadr_JqF0HS3mP6nvt_CquJvDRsyXys65TNNvw_I-QvukYASoH6EJP9qKM4aI9sKQ3rM37KKWai2Ny7ENo43pwjr2YWEXNbCj94QdDXRtmpnCU4fy2l2Rn4vJYvRzBubE9mk8U7qKuPzOFJX3EUO9wEejVDFBE1W_bUZH3s3mRgnOdKqRx2zizFte3VJ0NiDlTFqm_ufn7ErcnEN7JYcTflszQGtpYaJ5sGN2GL9zdBT9lkFj4GrSXrvsitaVV01oTuKFy8Xjl7sQZ3u9LuoFczYghQJhe80WxFA_yV1ErQ9vFHwkTKfRJkn1oU2Z6lgAcksnsvDEcWRO1TG_Ooz5CVaUrqfOTlBF_XN5GlBGS2Fvy6IpTPgK7wdG8eygx1__q3P1GP2nwuYDKo2MojA1pkUfXxMYAFQdEdCUpwosSHg0Ub02eH04SbtoRhu9g0EI7ftAXuqRqF2aC62rTsw2X-6ClEeQC3eoQEhgqPS58Tr6l110JSatEteOotkpGBFrzG182XwERBCba_Q27dq4c5By56TVS3bQCnJBegVC1KmeHrTrrkRtzRlwJSTeIb-j9YpSQch3L6fNDp8F47t6njpW5FAnYkkCyDTotaWRtOi4KhGPBKwZ8sphR5v5bNZ6gdwe40ssIQnQYDhJH18ruNLxUjNPhfPtgmkQcBfmyyVa8C7CXIi9irLny_khnRabKvrfkbt9I4NKcp5XSArOT_cAyLoKb4wiWNyDN01GpfhbTX_SmcrX0p59bMj1p-MebP3DMBI4j7nVmcfRgnXhNMSXDcv8eES_CHKybNwPNZzO9vNAkrWGrgsocF6Xbg5FRjodx2dLZ8AWHNsA4niPr8hFBVpDzjsZGfOMRY27MifC3PsPp0gYBL6Wb6eTpMMfhZpt11icvJu73TBC-ZSNlUuLVFmJlVQ3aJumyH-Q1PxLrWxg_OQ31Tt7yaew-ZD_p3kbr85YlBhvsdNUEaRzp2ojZD5MOZ4aPqUMLt2KjjZFNyhwXcN-MX6aits3bqB___oFSMO1k8Kb223phQO1TeDmAj-yeTsszyeIOFPbt93pPojnz9gPJACN8hOaP-k6fM3uYP_8Bi_nbyVVK2wlC7jYalcv0F4wCxg9mBadM2QU7V_wrUQl-V6iFf_4g5q2y2qHSJk3XivrbDOxOZ6d1y4qFVJ6cx2zoqbD8Mb-ed1aFINpzCsOODWAKcNa2p_1WLjXe2UeZfDFvmhIMCG639iL4sMZU9zBzeUFYQ-6esUY1-lgerLhO4v_AWkReJB0jCSkCKLbMTvAASs0f_Zll0qy_WBntoHZ1dpZP-5w52AbDzvEqMKtdEVwH3inZIbmtQzRieU3XYIcP13gYLHlhsMVizkJYwTizNWKNsrpDmdheJi0lGZKu_xsZsnmsId1kJLGqh0OSyezljtU4bmTXXJS55ys8_iydMxgxHcR_bjWaRxtcY0hrfH4rZ4PA5YSjIT4kcMY-IUzUockwhqDadCmC56sNMDqqiMB6FRKHmNrPzPTB8hjhY-mrG53cxYmBRjG31ablpeLQWnf5frkPj16S2TNZI3Wh2Xond3fXlarVkOaDhFDonLNt2jG3S7LV0W_SZVm99l7QNmadIfg0IMEBNdenMv_9irxcgA2m0GZN0T59aS0hnrd8R2iNAuWAC99BktHIIFr0ONSY5ythHZg_kElP9hoHd0dUIZ1CzZHVX1ZLxg5wvQcpNK-DY_c6QVHMLH3U8-397jNyffePGiUC31QORZxgGlldKaTkDDvI=	{"status": "ok", "processed": 6, "added": 0, "updated": 0, "partnerships_created": 0}	2026-09-29 18:47:33.563406
\.


--
-- Data for Name: catalog_managers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.catalog_managers (id, name) FROM stdin;
1	Иван Иванов
2	Андрей Махт
3	Павел Милючихин
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client (id, enabled, full_scope_allowed, client_id, not_before, public_client, secret, base_url, bearer_only, management_url, surrogate_auth_required, realm_id, protocol, node_rereg_timeout, frontchannel_logout, consent_required, name, service_accounts_enabled, client_authenticator_type, root_url, description, registration_token, standard_flow_enabled, implicit_flow_enabled, direct_access_grants_enabled, always_display_in_console) FROM stdin;
a97a30da-b5aa-4342-834a-bf05f3c14f17	t	f	master-realm	0	f	\N	\N	t	\N	f	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N	0	f	f	master Realm	f	client-secret	\N	\N	\N	t	f	f	f
d07b23c8-1068-4e2e-b24b-6201a6675145	t	f	account	0	t	\N	/realms/master/account/	f	\N	f	1d7cc020-ca7c-4805-9d61-79a209cf3578	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
4edd95c1-2acb-4896-92eb-697a7bb989e9	t	f	account-console	0	t	\N	/realms/master/account/	f	\N	f	1d7cc020-ca7c-4805-9d61-79a209cf3578	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
2302f5ea-b322-498b-9623-9a388f82a7d7	t	f	broker	0	f	\N	\N	t	\N	f	1d7cc020-ca7c-4805-9d61-79a209cf3578	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
32903730-aa4c-4168-bfed-397484fdcb8f	t	f	security-admin-console	0	t	\N	/admin/master/console/	f	\N	f	1d7cc020-ca7c-4805-9d61-79a209cf3578	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
8b1e8a97-862f-4c2f-a958-d641d7607974	t	f	admin-cli	0	t	\N	\N	f	\N	f	1d7cc020-ca7c-4805-9d61-79a209cf3578	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f
42a957bc-33c2-490e-9267-dad95c330449	t	f	rtk_crm-realm	0	f	\N	\N	t	\N	f	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N	0	f	f	rtk_crm Realm	f	client-secret	\N	\N	\N	t	f	f	f
002a7674-d7b3-43ff-ad90-ca181f02d51b	t	f	realm-management	0	f	\N	\N	t	\N	f	f8993e77-a2d6-4198-b3cd-9ad9cde21761	openid-connect	0	f	f	${client_realm-management}	f	client-secret	\N	\N	\N	t	f	f	f
979cf5ed-59e9-4aad-9b18-de51cab7976c	t	f	account	0	t	\N	/realms/rtk_crm/account/	f	\N	f	f8993e77-a2d6-4198-b3cd-9ad9cde21761	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
62044e40-147f-440f-8b05-316c210333c0	t	f	account-console	0	t	\N	/realms/rtk_crm/account/	f	\N	f	f8993e77-a2d6-4198-b3cd-9ad9cde21761	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
dcb728ea-06c0-4017-abb4-82b4ccdb4153	t	f	broker	0	f	\N	\N	t	\N	f	f8993e77-a2d6-4198-b3cd-9ad9cde21761	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	t	f	security-admin-console	0	t	\N	/admin/rtk_crm/console/	f	\N	f	f8993e77-a2d6-4198-b3cd-9ad9cde21761	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
8c62ffc4-c47b-45e3-9a6b-a39dba21a31d	t	f	admin-cli	0	t	\N	\N	f	\N	f	f8993e77-a2d6-4198-b3cd-9ad9cde21761	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	t	t	frontend-app	0	t	\N		f		f	f8993e77-a2d6-4198-b3cd-9ad9cde21761	openid-connect	-1	t	f		f	client-secret			\N	t	f	t	f
\.


--
-- Data for Name: client_attributes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_attributes (client_id, name, value) FROM stdin;
d07b23c8-1068-4e2e-b24b-6201a6675145	post.logout.redirect.uris	+
4edd95c1-2acb-4896-92eb-697a7bb989e9	post.logout.redirect.uris	+
4edd95c1-2acb-4896-92eb-697a7bb989e9	pkce.code.challenge.method	S256
32903730-aa4c-4168-bfed-397484fdcb8f	post.logout.redirect.uris	+
32903730-aa4c-4168-bfed-397484fdcb8f	pkce.code.challenge.method	S256
979cf5ed-59e9-4aad-9b18-de51cab7976c	post.logout.redirect.uris	+
62044e40-147f-440f-8b05-316c210333c0	post.logout.redirect.uris	+
62044e40-147f-440f-8b05-316c210333c0	pkce.code.challenge.method	S256
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	post.logout.redirect.uris	+
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	pkce.code.challenge.method	S256
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	oauth2.device.authorization.grant.enabled	false
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	oidc.ciba.grant.enabled	false
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	backchannel.logout.session.required	true
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	backchannel.logout.revoke.offline.tokens	false
\.


--
-- Data for Name: client_auth_flow_bindings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_auth_flow_bindings (client_id, flow_id, binding_name) FROM stdin;
\.


--
-- Data for Name: client_initial_access; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_initial_access (id, realm_id, "timestamp", expiration, count, remaining_count) FROM stdin;
\.


--
-- Data for Name: client_node_registrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_node_registrations (client_id, value, name) FROM stdin;
\.


--
-- Data for Name: client_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope (id, name, realm_id, description, protocol) FROM stdin;
4c90ff75-59de-48dd-89d3-3bb10580af21	offline_access	1d7cc020-ca7c-4805-9d61-79a209cf3578	OpenID Connect built-in scope: offline_access	openid-connect
03fa8f6c-a141-4b42-9ae2-b0437139053b	role_list	1d7cc020-ca7c-4805-9d61-79a209cf3578	SAML role list	saml
8c1e0ec1-f3d4-45b6-8324-14619440d5fd	profile	1d7cc020-ca7c-4805-9d61-79a209cf3578	OpenID Connect built-in scope: profile	openid-connect
d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	email	1d7cc020-ca7c-4805-9d61-79a209cf3578	OpenID Connect built-in scope: email	openid-connect
2048bb1b-f798-4783-b77c-72224f3627ca	address	1d7cc020-ca7c-4805-9d61-79a209cf3578	OpenID Connect built-in scope: address	openid-connect
4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	phone	1d7cc020-ca7c-4805-9d61-79a209cf3578	OpenID Connect built-in scope: phone	openid-connect
97ed2a8b-3705-42ae-a005-d0a56349ee58	roles	1d7cc020-ca7c-4805-9d61-79a209cf3578	OpenID Connect scope for add user roles to the access token	openid-connect
f78cd7d1-adb1-498a-897a-53c489b8045f	web-origins	1d7cc020-ca7c-4805-9d61-79a209cf3578	OpenID Connect scope for add allowed web origins to the access token	openid-connect
a462462f-aa61-4d23-8039-9955eb521d5d	microprofile-jwt	1d7cc020-ca7c-4805-9d61-79a209cf3578	Microprofile - JWT built-in scope	openid-connect
bb215a29-81ad-4b99-ad82-9fb85b7bc5b5	acr	1d7cc020-ca7c-4805-9d61-79a209cf3578	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
4112a896-e865-4dba-9814-7d0bf0b00e6c	offline_access	f8993e77-a2d6-4198-b3cd-9ad9cde21761	OpenID Connect built-in scope: offline_access	openid-connect
77f3dc38-56fe-4743-af3b-f8d0ff40468b	role_list	f8993e77-a2d6-4198-b3cd-9ad9cde21761	SAML role list	saml
0339b16c-a505-4f41-93a4-04161e9e522a	profile	f8993e77-a2d6-4198-b3cd-9ad9cde21761	OpenID Connect built-in scope: profile	openid-connect
a2dc8517-e672-479d-bff8-ab3731f6a171	email	f8993e77-a2d6-4198-b3cd-9ad9cde21761	OpenID Connect built-in scope: email	openid-connect
31a35b59-b201-41b5-8679-9ff5c03137f2	address	f8993e77-a2d6-4198-b3cd-9ad9cde21761	OpenID Connect built-in scope: address	openid-connect
4be0913c-3e2d-4d6f-8515-a172956218fa	phone	f8993e77-a2d6-4198-b3cd-9ad9cde21761	OpenID Connect built-in scope: phone	openid-connect
8c74e6a0-ce32-4f60-aa23-14bae645899f	roles	f8993e77-a2d6-4198-b3cd-9ad9cde21761	OpenID Connect scope for add user roles to the access token	openid-connect
b909417c-0ceb-4eed-813c-e50329977475	web-origins	f8993e77-a2d6-4198-b3cd-9ad9cde21761	OpenID Connect scope for add allowed web origins to the access token	openid-connect
ba6d589b-caa7-4389-bee3-b101fbd3554d	microprofile-jwt	f8993e77-a2d6-4198-b3cd-9ad9cde21761	Microprofile - JWT built-in scope	openid-connect
a44c4fc4-0e62-4265-ac6f-09de59422bd8	acr	f8993e77-a2d6-4198-b3cd-9ad9cde21761	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
\.


--
-- Data for Name: client_scope_attributes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope_attributes (scope_id, value, name) FROM stdin;
4c90ff75-59de-48dd-89d3-3bb10580af21	true	display.on.consent.screen
4c90ff75-59de-48dd-89d3-3bb10580af21	${offlineAccessScopeConsentText}	consent.screen.text
03fa8f6c-a141-4b42-9ae2-b0437139053b	true	display.on.consent.screen
03fa8f6c-a141-4b42-9ae2-b0437139053b	${samlRoleListScopeConsentText}	consent.screen.text
8c1e0ec1-f3d4-45b6-8324-14619440d5fd	true	display.on.consent.screen
8c1e0ec1-f3d4-45b6-8324-14619440d5fd	${profileScopeConsentText}	consent.screen.text
8c1e0ec1-f3d4-45b6-8324-14619440d5fd	true	include.in.token.scope
d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	true	display.on.consent.screen
d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	${emailScopeConsentText}	consent.screen.text
d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	true	include.in.token.scope
2048bb1b-f798-4783-b77c-72224f3627ca	true	display.on.consent.screen
2048bb1b-f798-4783-b77c-72224f3627ca	${addressScopeConsentText}	consent.screen.text
2048bb1b-f798-4783-b77c-72224f3627ca	true	include.in.token.scope
4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	true	display.on.consent.screen
4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	${phoneScopeConsentText}	consent.screen.text
4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	true	include.in.token.scope
97ed2a8b-3705-42ae-a005-d0a56349ee58	true	display.on.consent.screen
97ed2a8b-3705-42ae-a005-d0a56349ee58	${rolesScopeConsentText}	consent.screen.text
97ed2a8b-3705-42ae-a005-d0a56349ee58	false	include.in.token.scope
f78cd7d1-adb1-498a-897a-53c489b8045f	false	display.on.consent.screen
f78cd7d1-adb1-498a-897a-53c489b8045f		consent.screen.text
f78cd7d1-adb1-498a-897a-53c489b8045f	false	include.in.token.scope
a462462f-aa61-4d23-8039-9955eb521d5d	false	display.on.consent.screen
a462462f-aa61-4d23-8039-9955eb521d5d	true	include.in.token.scope
bb215a29-81ad-4b99-ad82-9fb85b7bc5b5	false	display.on.consent.screen
bb215a29-81ad-4b99-ad82-9fb85b7bc5b5	false	include.in.token.scope
4112a896-e865-4dba-9814-7d0bf0b00e6c	true	display.on.consent.screen
4112a896-e865-4dba-9814-7d0bf0b00e6c	${offlineAccessScopeConsentText}	consent.screen.text
77f3dc38-56fe-4743-af3b-f8d0ff40468b	true	display.on.consent.screen
77f3dc38-56fe-4743-af3b-f8d0ff40468b	${samlRoleListScopeConsentText}	consent.screen.text
0339b16c-a505-4f41-93a4-04161e9e522a	true	display.on.consent.screen
0339b16c-a505-4f41-93a4-04161e9e522a	${profileScopeConsentText}	consent.screen.text
0339b16c-a505-4f41-93a4-04161e9e522a	true	include.in.token.scope
a2dc8517-e672-479d-bff8-ab3731f6a171	true	display.on.consent.screen
a2dc8517-e672-479d-bff8-ab3731f6a171	${emailScopeConsentText}	consent.screen.text
a2dc8517-e672-479d-bff8-ab3731f6a171	true	include.in.token.scope
31a35b59-b201-41b5-8679-9ff5c03137f2	true	display.on.consent.screen
31a35b59-b201-41b5-8679-9ff5c03137f2	${addressScopeConsentText}	consent.screen.text
31a35b59-b201-41b5-8679-9ff5c03137f2	true	include.in.token.scope
4be0913c-3e2d-4d6f-8515-a172956218fa	true	display.on.consent.screen
4be0913c-3e2d-4d6f-8515-a172956218fa	${phoneScopeConsentText}	consent.screen.text
4be0913c-3e2d-4d6f-8515-a172956218fa	true	include.in.token.scope
8c74e6a0-ce32-4f60-aa23-14bae645899f	true	display.on.consent.screen
8c74e6a0-ce32-4f60-aa23-14bae645899f	${rolesScopeConsentText}	consent.screen.text
8c74e6a0-ce32-4f60-aa23-14bae645899f	false	include.in.token.scope
b909417c-0ceb-4eed-813c-e50329977475	false	display.on.consent.screen
b909417c-0ceb-4eed-813c-e50329977475		consent.screen.text
b909417c-0ceb-4eed-813c-e50329977475	false	include.in.token.scope
ba6d589b-caa7-4389-bee3-b101fbd3554d	false	display.on.consent.screen
ba6d589b-caa7-4389-bee3-b101fbd3554d	true	include.in.token.scope
a44c4fc4-0e62-4265-ac6f-09de59422bd8	false	display.on.consent.screen
a44c4fc4-0e62-4265-ac6f-09de59422bd8	false	include.in.token.scope
\.


--
-- Data for Name: client_scope_client; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope_client (client_id, scope_id, default_scope) FROM stdin;
d07b23c8-1068-4e2e-b24b-6201a6675145	8c1e0ec1-f3d4-45b6-8324-14619440d5fd	t
d07b23c8-1068-4e2e-b24b-6201a6675145	97ed2a8b-3705-42ae-a005-d0a56349ee58	t
d07b23c8-1068-4e2e-b24b-6201a6675145	f78cd7d1-adb1-498a-897a-53c489b8045f	t
d07b23c8-1068-4e2e-b24b-6201a6675145	d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	t
d07b23c8-1068-4e2e-b24b-6201a6675145	bb215a29-81ad-4b99-ad82-9fb85b7bc5b5	t
d07b23c8-1068-4e2e-b24b-6201a6675145	2048bb1b-f798-4783-b77c-72224f3627ca	f
d07b23c8-1068-4e2e-b24b-6201a6675145	4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	f
d07b23c8-1068-4e2e-b24b-6201a6675145	a462462f-aa61-4d23-8039-9955eb521d5d	f
d07b23c8-1068-4e2e-b24b-6201a6675145	4c90ff75-59de-48dd-89d3-3bb10580af21	f
4edd95c1-2acb-4896-92eb-697a7bb989e9	8c1e0ec1-f3d4-45b6-8324-14619440d5fd	t
4edd95c1-2acb-4896-92eb-697a7bb989e9	97ed2a8b-3705-42ae-a005-d0a56349ee58	t
4edd95c1-2acb-4896-92eb-697a7bb989e9	f78cd7d1-adb1-498a-897a-53c489b8045f	t
4edd95c1-2acb-4896-92eb-697a7bb989e9	d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	t
4edd95c1-2acb-4896-92eb-697a7bb989e9	bb215a29-81ad-4b99-ad82-9fb85b7bc5b5	t
4edd95c1-2acb-4896-92eb-697a7bb989e9	2048bb1b-f798-4783-b77c-72224f3627ca	f
4edd95c1-2acb-4896-92eb-697a7bb989e9	4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	f
4edd95c1-2acb-4896-92eb-697a7bb989e9	a462462f-aa61-4d23-8039-9955eb521d5d	f
4edd95c1-2acb-4896-92eb-697a7bb989e9	4c90ff75-59de-48dd-89d3-3bb10580af21	f
8b1e8a97-862f-4c2f-a958-d641d7607974	8c1e0ec1-f3d4-45b6-8324-14619440d5fd	t
8b1e8a97-862f-4c2f-a958-d641d7607974	97ed2a8b-3705-42ae-a005-d0a56349ee58	t
8b1e8a97-862f-4c2f-a958-d641d7607974	f78cd7d1-adb1-498a-897a-53c489b8045f	t
8b1e8a97-862f-4c2f-a958-d641d7607974	d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	t
8b1e8a97-862f-4c2f-a958-d641d7607974	bb215a29-81ad-4b99-ad82-9fb85b7bc5b5	t
8b1e8a97-862f-4c2f-a958-d641d7607974	2048bb1b-f798-4783-b77c-72224f3627ca	f
8b1e8a97-862f-4c2f-a958-d641d7607974	4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	f
8b1e8a97-862f-4c2f-a958-d641d7607974	a462462f-aa61-4d23-8039-9955eb521d5d	f
8b1e8a97-862f-4c2f-a958-d641d7607974	4c90ff75-59de-48dd-89d3-3bb10580af21	f
2302f5ea-b322-498b-9623-9a388f82a7d7	8c1e0ec1-f3d4-45b6-8324-14619440d5fd	t
2302f5ea-b322-498b-9623-9a388f82a7d7	97ed2a8b-3705-42ae-a005-d0a56349ee58	t
2302f5ea-b322-498b-9623-9a388f82a7d7	f78cd7d1-adb1-498a-897a-53c489b8045f	t
2302f5ea-b322-498b-9623-9a388f82a7d7	d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	t
2302f5ea-b322-498b-9623-9a388f82a7d7	bb215a29-81ad-4b99-ad82-9fb85b7bc5b5	t
2302f5ea-b322-498b-9623-9a388f82a7d7	2048bb1b-f798-4783-b77c-72224f3627ca	f
2302f5ea-b322-498b-9623-9a388f82a7d7	4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	f
2302f5ea-b322-498b-9623-9a388f82a7d7	a462462f-aa61-4d23-8039-9955eb521d5d	f
2302f5ea-b322-498b-9623-9a388f82a7d7	4c90ff75-59de-48dd-89d3-3bb10580af21	f
a97a30da-b5aa-4342-834a-bf05f3c14f17	8c1e0ec1-f3d4-45b6-8324-14619440d5fd	t
a97a30da-b5aa-4342-834a-bf05f3c14f17	97ed2a8b-3705-42ae-a005-d0a56349ee58	t
a97a30da-b5aa-4342-834a-bf05f3c14f17	f78cd7d1-adb1-498a-897a-53c489b8045f	t
a97a30da-b5aa-4342-834a-bf05f3c14f17	d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	t
a97a30da-b5aa-4342-834a-bf05f3c14f17	bb215a29-81ad-4b99-ad82-9fb85b7bc5b5	t
a97a30da-b5aa-4342-834a-bf05f3c14f17	2048bb1b-f798-4783-b77c-72224f3627ca	f
a97a30da-b5aa-4342-834a-bf05f3c14f17	4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	f
a97a30da-b5aa-4342-834a-bf05f3c14f17	a462462f-aa61-4d23-8039-9955eb521d5d	f
a97a30da-b5aa-4342-834a-bf05f3c14f17	4c90ff75-59de-48dd-89d3-3bb10580af21	f
32903730-aa4c-4168-bfed-397484fdcb8f	8c1e0ec1-f3d4-45b6-8324-14619440d5fd	t
32903730-aa4c-4168-bfed-397484fdcb8f	97ed2a8b-3705-42ae-a005-d0a56349ee58	t
32903730-aa4c-4168-bfed-397484fdcb8f	f78cd7d1-adb1-498a-897a-53c489b8045f	t
32903730-aa4c-4168-bfed-397484fdcb8f	d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	t
32903730-aa4c-4168-bfed-397484fdcb8f	bb215a29-81ad-4b99-ad82-9fb85b7bc5b5	t
32903730-aa4c-4168-bfed-397484fdcb8f	2048bb1b-f798-4783-b77c-72224f3627ca	f
32903730-aa4c-4168-bfed-397484fdcb8f	4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	f
32903730-aa4c-4168-bfed-397484fdcb8f	a462462f-aa61-4d23-8039-9955eb521d5d	f
32903730-aa4c-4168-bfed-397484fdcb8f	4c90ff75-59de-48dd-89d3-3bb10580af21	f
979cf5ed-59e9-4aad-9b18-de51cab7976c	8c74e6a0-ce32-4f60-aa23-14bae645899f	t
979cf5ed-59e9-4aad-9b18-de51cab7976c	a44c4fc4-0e62-4265-ac6f-09de59422bd8	t
979cf5ed-59e9-4aad-9b18-de51cab7976c	b909417c-0ceb-4eed-813c-e50329977475	t
979cf5ed-59e9-4aad-9b18-de51cab7976c	0339b16c-a505-4f41-93a4-04161e9e522a	t
979cf5ed-59e9-4aad-9b18-de51cab7976c	a2dc8517-e672-479d-bff8-ab3731f6a171	t
979cf5ed-59e9-4aad-9b18-de51cab7976c	4be0913c-3e2d-4d6f-8515-a172956218fa	f
979cf5ed-59e9-4aad-9b18-de51cab7976c	ba6d589b-caa7-4389-bee3-b101fbd3554d	f
979cf5ed-59e9-4aad-9b18-de51cab7976c	31a35b59-b201-41b5-8679-9ff5c03137f2	f
979cf5ed-59e9-4aad-9b18-de51cab7976c	4112a896-e865-4dba-9814-7d0bf0b00e6c	f
62044e40-147f-440f-8b05-316c210333c0	8c74e6a0-ce32-4f60-aa23-14bae645899f	t
62044e40-147f-440f-8b05-316c210333c0	a44c4fc4-0e62-4265-ac6f-09de59422bd8	t
62044e40-147f-440f-8b05-316c210333c0	b909417c-0ceb-4eed-813c-e50329977475	t
62044e40-147f-440f-8b05-316c210333c0	0339b16c-a505-4f41-93a4-04161e9e522a	t
62044e40-147f-440f-8b05-316c210333c0	a2dc8517-e672-479d-bff8-ab3731f6a171	t
62044e40-147f-440f-8b05-316c210333c0	4be0913c-3e2d-4d6f-8515-a172956218fa	f
62044e40-147f-440f-8b05-316c210333c0	ba6d589b-caa7-4389-bee3-b101fbd3554d	f
62044e40-147f-440f-8b05-316c210333c0	31a35b59-b201-41b5-8679-9ff5c03137f2	f
62044e40-147f-440f-8b05-316c210333c0	4112a896-e865-4dba-9814-7d0bf0b00e6c	f
8c62ffc4-c47b-45e3-9a6b-a39dba21a31d	8c74e6a0-ce32-4f60-aa23-14bae645899f	t
8c62ffc4-c47b-45e3-9a6b-a39dba21a31d	a44c4fc4-0e62-4265-ac6f-09de59422bd8	t
8c62ffc4-c47b-45e3-9a6b-a39dba21a31d	b909417c-0ceb-4eed-813c-e50329977475	t
8c62ffc4-c47b-45e3-9a6b-a39dba21a31d	0339b16c-a505-4f41-93a4-04161e9e522a	t
8c62ffc4-c47b-45e3-9a6b-a39dba21a31d	a2dc8517-e672-479d-bff8-ab3731f6a171	t
8c62ffc4-c47b-45e3-9a6b-a39dba21a31d	4be0913c-3e2d-4d6f-8515-a172956218fa	f
8c62ffc4-c47b-45e3-9a6b-a39dba21a31d	ba6d589b-caa7-4389-bee3-b101fbd3554d	f
8c62ffc4-c47b-45e3-9a6b-a39dba21a31d	31a35b59-b201-41b5-8679-9ff5c03137f2	f
8c62ffc4-c47b-45e3-9a6b-a39dba21a31d	4112a896-e865-4dba-9814-7d0bf0b00e6c	f
dcb728ea-06c0-4017-abb4-82b4ccdb4153	8c74e6a0-ce32-4f60-aa23-14bae645899f	t
dcb728ea-06c0-4017-abb4-82b4ccdb4153	a44c4fc4-0e62-4265-ac6f-09de59422bd8	t
dcb728ea-06c0-4017-abb4-82b4ccdb4153	b909417c-0ceb-4eed-813c-e50329977475	t
dcb728ea-06c0-4017-abb4-82b4ccdb4153	0339b16c-a505-4f41-93a4-04161e9e522a	t
dcb728ea-06c0-4017-abb4-82b4ccdb4153	a2dc8517-e672-479d-bff8-ab3731f6a171	t
dcb728ea-06c0-4017-abb4-82b4ccdb4153	4be0913c-3e2d-4d6f-8515-a172956218fa	f
dcb728ea-06c0-4017-abb4-82b4ccdb4153	ba6d589b-caa7-4389-bee3-b101fbd3554d	f
dcb728ea-06c0-4017-abb4-82b4ccdb4153	31a35b59-b201-41b5-8679-9ff5c03137f2	f
dcb728ea-06c0-4017-abb4-82b4ccdb4153	4112a896-e865-4dba-9814-7d0bf0b00e6c	f
002a7674-d7b3-43ff-ad90-ca181f02d51b	8c74e6a0-ce32-4f60-aa23-14bae645899f	t
002a7674-d7b3-43ff-ad90-ca181f02d51b	a44c4fc4-0e62-4265-ac6f-09de59422bd8	t
002a7674-d7b3-43ff-ad90-ca181f02d51b	b909417c-0ceb-4eed-813c-e50329977475	t
002a7674-d7b3-43ff-ad90-ca181f02d51b	0339b16c-a505-4f41-93a4-04161e9e522a	t
002a7674-d7b3-43ff-ad90-ca181f02d51b	a2dc8517-e672-479d-bff8-ab3731f6a171	t
002a7674-d7b3-43ff-ad90-ca181f02d51b	4be0913c-3e2d-4d6f-8515-a172956218fa	f
002a7674-d7b3-43ff-ad90-ca181f02d51b	ba6d589b-caa7-4389-bee3-b101fbd3554d	f
002a7674-d7b3-43ff-ad90-ca181f02d51b	31a35b59-b201-41b5-8679-9ff5c03137f2	f
002a7674-d7b3-43ff-ad90-ca181f02d51b	4112a896-e865-4dba-9814-7d0bf0b00e6c	f
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	8c74e6a0-ce32-4f60-aa23-14bae645899f	t
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	a44c4fc4-0e62-4265-ac6f-09de59422bd8	t
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	b909417c-0ceb-4eed-813c-e50329977475	t
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	0339b16c-a505-4f41-93a4-04161e9e522a	t
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	a2dc8517-e672-479d-bff8-ab3731f6a171	t
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	4be0913c-3e2d-4d6f-8515-a172956218fa	f
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	ba6d589b-caa7-4389-bee3-b101fbd3554d	f
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	31a35b59-b201-41b5-8679-9ff5c03137f2	f
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	4112a896-e865-4dba-9814-7d0bf0b00e6c	f
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	8c74e6a0-ce32-4f60-aa23-14bae645899f	t
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	a44c4fc4-0e62-4265-ac6f-09de59422bd8	t
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	b909417c-0ceb-4eed-813c-e50329977475	t
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	0339b16c-a505-4f41-93a4-04161e9e522a	t
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	a2dc8517-e672-479d-bff8-ab3731f6a171	t
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	4be0913c-3e2d-4d6f-8515-a172956218fa	f
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	ba6d589b-caa7-4389-bee3-b101fbd3554d	f
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	31a35b59-b201-41b5-8679-9ff5c03137f2	f
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	4112a896-e865-4dba-9814-7d0bf0b00e6c	f
\.


--
-- Data for Name: client_scope_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope_role_mapping (scope_id, role_id) FROM stdin;
4c90ff75-59de-48dd-89d3-3bb10580af21	8120f2e5-3134-4625-86ce-204510084f2f
4112a896-e865-4dba-9814-7d0bf0b00e6c	5b40b904-4d2c-4bac-810a-d94c37fa7b7c
\.


--
-- Data for Name: client_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session (id, client_id, redirect_uri, state, "timestamp", session_id, auth_method, realm_id, auth_user_id, current_action) FROM stdin;
\.


--
-- Data for Name: client_session_auth_status; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_auth_status (authenticator, status, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_note; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_note (name, value, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_prot_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_prot_mapper (protocol_mapper_id, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_role (role_id, client_session) FROM stdin;
\.


--
-- Data for Name: client_user_session_note; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_user_session_note (name, value, client_session) FROM stdin;
\.


--
-- Data for Name: component; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.component (id, name, parent_id, provider_id, provider_type, realm_id, sub_type) FROM stdin;
e857a9a8-2dc9-49ce-bc18-0dfba947c0b4	Trusted Hosts	1d7cc020-ca7c-4805-9d61-79a209cf3578	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	1d7cc020-ca7c-4805-9d61-79a209cf3578	anonymous
786f859e-fb80-44b1-a285-c6f19a90047c	Consent Required	1d7cc020-ca7c-4805-9d61-79a209cf3578	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	1d7cc020-ca7c-4805-9d61-79a209cf3578	anonymous
b5723bf4-c12b-4394-aa9b-9ddb660ff0bf	Full Scope Disabled	1d7cc020-ca7c-4805-9d61-79a209cf3578	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	1d7cc020-ca7c-4805-9d61-79a209cf3578	anonymous
b56c5f6a-2f63-4d75-a301-080ac9e1330f	Max Clients Limit	1d7cc020-ca7c-4805-9d61-79a209cf3578	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	1d7cc020-ca7c-4805-9d61-79a209cf3578	anonymous
693186ea-503f-4c11-b8d1-8b1333702778	Allowed Protocol Mapper Types	1d7cc020-ca7c-4805-9d61-79a209cf3578	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	1d7cc020-ca7c-4805-9d61-79a209cf3578	anonymous
ba96b80d-3da5-474d-81ca-31c10063e247	Allowed Client Scopes	1d7cc020-ca7c-4805-9d61-79a209cf3578	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	1d7cc020-ca7c-4805-9d61-79a209cf3578	anonymous
842bd97a-4c45-46e7-82ec-1d20f60f2f12	Allowed Protocol Mapper Types	1d7cc020-ca7c-4805-9d61-79a209cf3578	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	1d7cc020-ca7c-4805-9d61-79a209cf3578	authenticated
0b234868-5b2a-413e-97ca-fb560efee3fc	Allowed Client Scopes	1d7cc020-ca7c-4805-9d61-79a209cf3578	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	1d7cc020-ca7c-4805-9d61-79a209cf3578	authenticated
cf63d1ff-3f94-4888-bb96-aa60f4641d5d	rsa-generated	1d7cc020-ca7c-4805-9d61-79a209cf3578	rsa-generated	org.keycloak.keys.KeyProvider	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N
fdab0ae4-ec3c-41f9-8a9f-27ddc6fd08cf	rsa-enc-generated	1d7cc020-ca7c-4805-9d61-79a209cf3578	rsa-enc-generated	org.keycloak.keys.KeyProvider	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N
e652989b-166b-4669-a783-d4c60362df7d	hmac-generated	1d7cc020-ca7c-4805-9d61-79a209cf3578	hmac-generated	org.keycloak.keys.KeyProvider	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N
c622186c-e4c1-4f8a-8672-d005eaa84853	aes-generated	1d7cc020-ca7c-4805-9d61-79a209cf3578	aes-generated	org.keycloak.keys.KeyProvider	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N
93f255c8-b9db-480e-b7fa-d7197f74aec3	rsa-generated	f8993e77-a2d6-4198-b3cd-9ad9cde21761	rsa-generated	org.keycloak.keys.KeyProvider	f8993e77-a2d6-4198-b3cd-9ad9cde21761	\N
55659481-1d02-4b6a-b09d-51e14e5711be	rsa-enc-generated	f8993e77-a2d6-4198-b3cd-9ad9cde21761	rsa-enc-generated	org.keycloak.keys.KeyProvider	f8993e77-a2d6-4198-b3cd-9ad9cde21761	\N
e7e3deb4-12f6-41b0-b465-0539369f8705	hmac-generated	f8993e77-a2d6-4198-b3cd-9ad9cde21761	hmac-generated	org.keycloak.keys.KeyProvider	f8993e77-a2d6-4198-b3cd-9ad9cde21761	\N
6665bad9-6811-499c-b727-7a590cb955ee	aes-generated	f8993e77-a2d6-4198-b3cd-9ad9cde21761	aes-generated	org.keycloak.keys.KeyProvider	f8993e77-a2d6-4198-b3cd-9ad9cde21761	\N
76f1a9b9-3766-4226-bc02-9fdeaad639e4	Trusted Hosts	f8993e77-a2d6-4198-b3cd-9ad9cde21761	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	f8993e77-a2d6-4198-b3cd-9ad9cde21761	anonymous
f88cf4f0-de4b-4125-8896-a7cf48de3fd3	Consent Required	f8993e77-a2d6-4198-b3cd-9ad9cde21761	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	f8993e77-a2d6-4198-b3cd-9ad9cde21761	anonymous
f52ddbb7-1309-4760-9076-582c4a88c615	Full Scope Disabled	f8993e77-a2d6-4198-b3cd-9ad9cde21761	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	f8993e77-a2d6-4198-b3cd-9ad9cde21761	anonymous
cf340d4a-4d85-45b9-b452-7f98e93120f2	Max Clients Limit	f8993e77-a2d6-4198-b3cd-9ad9cde21761	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	f8993e77-a2d6-4198-b3cd-9ad9cde21761	anonymous
f2c9224e-81bd-464c-aeb4-da35ea8eec9c	Allowed Protocol Mapper Types	f8993e77-a2d6-4198-b3cd-9ad9cde21761	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	f8993e77-a2d6-4198-b3cd-9ad9cde21761	anonymous
3eb9371b-4b6c-4f6a-b07e-d2108228dceb	Allowed Client Scopes	f8993e77-a2d6-4198-b3cd-9ad9cde21761	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	f8993e77-a2d6-4198-b3cd-9ad9cde21761	anonymous
76dd5a65-4f1f-4cc8-b38b-8a68e4af245c	Allowed Protocol Mapper Types	f8993e77-a2d6-4198-b3cd-9ad9cde21761	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	f8993e77-a2d6-4198-b3cd-9ad9cde21761	authenticated
1394996b-4fea-4ca3-af21-f8e33e9a527f	Allowed Client Scopes	f8993e77-a2d6-4198-b3cd-9ad9cde21761	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	f8993e77-a2d6-4198-b3cd-9ad9cde21761	authenticated
\.


--
-- Data for Name: component_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.component_config (id, component_id, name, value) FROM stdin;
373bd8d4-1fe3-4805-9135-2c82c8f70f03	842bd97a-4c45-46e7-82ec-1d20f60f2f12	allowed-protocol-mapper-types	oidc-full-name-mapper
2f1be9a2-f473-4150-a8a1-a340d7e241ed	842bd97a-4c45-46e7-82ec-1d20f60f2f12	allowed-protocol-mapper-types	saml-role-list-mapper
fe0f2c6e-2f81-4566-a60c-dae813856d2c	842bd97a-4c45-46e7-82ec-1d20f60f2f12	allowed-protocol-mapper-types	saml-user-attribute-mapper
a47d6fa8-2cce-4459-a592-8b1fc2638a36	842bd97a-4c45-46e7-82ec-1d20f60f2f12	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
74c10c59-3a85-47b8-ad4e-82e49cb33b90	842bd97a-4c45-46e7-82ec-1d20f60f2f12	allowed-protocol-mapper-types	saml-user-property-mapper
63b5f7d6-28fa-4ac6-88b7-6630dfd9c57f	842bd97a-4c45-46e7-82ec-1d20f60f2f12	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
0ffbf236-b281-43c9-be95-f984bae10f4a	842bd97a-4c45-46e7-82ec-1d20f60f2f12	allowed-protocol-mapper-types	oidc-address-mapper
0e158f34-dd08-470f-9453-67a8f8e5c5da	842bd97a-4c45-46e7-82ec-1d20f60f2f12	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
63280f97-c0e7-4b3f-b865-4b0724d52354	b56c5f6a-2f63-4d75-a301-080ac9e1330f	max-clients	200
429b6817-efcc-4b54-8927-79b5e9585b55	0b234868-5b2a-413e-97ca-fb560efee3fc	allow-default-scopes	true
88199a41-00f9-4f41-a798-3b2e9ccc4981	ba96b80d-3da5-474d-81ca-31c10063e247	allow-default-scopes	true
0fb06d8d-ca6d-4bf0-bd4d-8afe814d3a76	693186ea-503f-4c11-b8d1-8b1333702778	allowed-protocol-mapper-types	saml-role-list-mapper
80575491-1ceb-4fcf-aaef-ce6b63ce606b	693186ea-503f-4c11-b8d1-8b1333702778	allowed-protocol-mapper-types	saml-user-property-mapper
2722a70b-ab5a-4ce7-afd5-548f911bf20b	693186ea-503f-4c11-b8d1-8b1333702778	allowed-protocol-mapper-types	oidc-full-name-mapper
c802958d-2c28-4242-843f-69f84ffd0f46	693186ea-503f-4c11-b8d1-8b1333702778	allowed-protocol-mapper-types	oidc-address-mapper
5b6d1ea6-baca-44a7-b2e0-acd4d7997bef	693186ea-503f-4c11-b8d1-8b1333702778	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
07bfcc10-f6fb-4218-a337-c371642ff571	693186ea-503f-4c11-b8d1-8b1333702778	allowed-protocol-mapper-types	saml-user-attribute-mapper
8411f06a-5a52-4949-88d8-58ddce89c817	693186ea-503f-4c11-b8d1-8b1333702778	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
51a84296-5a1a-4ac7-85bb-ae0675a6fb32	693186ea-503f-4c11-b8d1-8b1333702778	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
0c4535b3-74b7-4cf8-a8f5-8aee0e1200e7	e857a9a8-2dc9-49ce-bc18-0dfba947c0b4	client-uris-must-match	true
8e597d0c-c791-49be-a0d7-306d36cd2ec4	e857a9a8-2dc9-49ce-bc18-0dfba947c0b4	host-sending-registration-request-must-match	true
3991c5a3-5f2d-4d01-836c-2dd55402c082	c622186c-e4c1-4f8a-8672-d005eaa84853	kid	60ebc0ff-cb73-4154-baba-00f65ef93565
3593a407-38bb-4786-82ba-16c4d24a6386	c622186c-e4c1-4f8a-8672-d005eaa84853	priority	100
9cda7698-bf36-439a-b5e0-10c6e5ef4780	c622186c-e4c1-4f8a-8672-d005eaa84853	secret	G2j4Wfy_3DCkWKamZQzvxg
c7ade407-5de8-4225-ada2-3eecd1216645	fdab0ae4-ec3c-41f9-8a9f-27ddc6fd08cf	certificate	MIICmzCCAYMCBgGg6O4vezANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjYwOTI4MTY1MDE4WhcNMzYwOTI4MTY1MTU4WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCvD71fvaS2/p/n874CGyRZhDEvOPeb/Snr3i3F+G56qkfF97ag0KAOmcAn2AFBTFUW7vucTCufF1eTaKRszI5HmXilQpFj1KkGuMx14a82ZarsvPfkyKq9whZtf7K31UMzaJk2OdpoOMJpvMSTLFU+2JNzHGpLYR2hO6fmIpE1tD4ttQFaF47jIeGbPILEOdZM/j6SF03AyYGTLemTuhiZq40YxU4JfmUMPD2ub4xqtzGTJypsAdOKTNoCiHOHO29tZs1Jo+UTAJsrhZ6I7N3ZWt44nwEygSzO+bLOLhYDhc34niobuRCgZQOt5N2b9wTeqyoTvrBNhFv8AxU2K8N5AgMBAAEwDQYJKoZIhvcNAQELBQADggEBAKNkwlx44WBjv56QRCuNWPp92SJsD6NPDz63/ocVtfDk2H2hLkBxIDPmgzl/1UIrk+5lVXvOWMdjzPecGQWeCd9G/w19jAq+GhyHjrBYawiN+CQs8+lJMouQI05SnTst2ZOIF3gbmSOAEdCAGQFgUWTnltUnwF0fC5M7q8i0Wjcd854BXS5KD1K3zH/9Hiv8ERpsvgszvwuesjC+ndqXKK5QSCW2Xrk8UbWzrPvOFZsvvpoUR1leqKpiMXzpbW8sK2CWiSgcuk2Ji5wg0Ssb1QBhypcm4YKyGH/lBrSJvw++0Rp5W+1gh3fmADm83WAn5EImowqMGGkPXjOZyt3NWAw=
b4ff30c1-3b41-427b-98a7-d0286371c6a8	fdab0ae4-ec3c-41f9-8a9f-27ddc6fd08cf	algorithm	RSA-OAEP
e5db068f-1058-4d0a-a5f8-49bbd356b5f0	fdab0ae4-ec3c-41f9-8a9f-27ddc6fd08cf	keyUse	ENC
c3cee0d0-af01-426c-8924-f4bbcbc6f638	fdab0ae4-ec3c-41f9-8a9f-27ddc6fd08cf	priority	100
42004fcf-1203-4798-b7e5-aa86a7ddc042	fdab0ae4-ec3c-41f9-8a9f-27ddc6fd08cf	privateKey	MIIEowIBAAKCAQEArw+9X72ktv6f5/O+AhskWYQxLzj3m/0p694txfhueqpHxfe2oNCgDpnAJ9gBQUxVFu77nEwrnxdXk2ikbMyOR5l4pUKRY9SpBrjMdeGvNmWq7Lz35MiqvcIWbX+yt9VDM2iZNjnaaDjCabzEkyxVPtiTcxxqS2EdoTun5iKRNbQ+LbUBWheO4yHhmzyCxDnWTP4+khdNwMmBky3pk7oYmauNGMVOCX5lDDw9rm+MarcxkycqbAHTikzaAohzhztvbWbNSaPlEwCbK4WeiOzd2VreOJ8BMoEszvmyzi4WA4XN+J4qG7kQoGUDreTdm/cE3qsqE76wTYRb/AMVNivDeQIDAQABAoIBAAWFCScshTXlYaCYQ3aQyUS+yae347vB/9lBZj9SmdYpig2MhdA8f71yHNhMw95dlCW+14VaM/pmS6M41o1dJkPM65xHVOr5RLKS71Rsrx/3lOv1udm3d4W36cneT8Hi2iVz7/fBG3kzh/K6SlbrHA15Ge4UWGgjyeHAbibwElTHeos88pKHagT7LOPZbSmyr+cQFBAkK8LbuU9rPSN+jz23DpO/HM3bK24VSpjMuIlnjFtnlYp6zYBYkDq5GFYMs2IbJVbZmOhMDltqI/Q0h2+Rmk9aUYmnYN7crZrQPDwQeU206o74jvT2xTx9XRdplfJgOK0xEBIclUAY6ZrZQhECgYEA7JUFvDBoiJrxC0qb3F6tRFKSVxmxUdYOvh5FKURe+h9KErAOxDJtf5T2IEFrF+4s+yZy1cYxvsIn2fLK+3KVYMjKlJ5/2z3hMs6bP2LV7gQZBzHtP3MIIlkkusoYeuxpGQOQFJmFN9k5c4Jfp0ld8Ry1u04qPVICOwUBccbs/zECgYEAvW4RbcUqVYGSzWxDDP3rZPXTEnqVefRNQZahuZtKXW0CptzlnBoftkeQnI4aS46KJjN5qSWvYIF1ST57uTJ0as8ZsjgWVROs5nBF/OyjcJpb4xRuGKi78/2/OwJ6agJB76xp5iKfo4DR38Re76QcLyBTTXzP7fdyiTHVTslQRskCgYAxENcXqJKFglzrkpWwppIY0Wc4WUPFTTfRhkWhwWRRS5v5NDpbxnmfNC23ktm7JNJ/ZAH9BBXdEjdhpFEkxSbl477gA99QgQzrlJ3uD3l+26q1K02hEyJkvUg41SEunUlOvsZq/0v5wTuBEVD1SOoKz4GBTzzDava7dtZN2ovcgQKBgDOnowsK28trROvNXM9bImhqfD8qvD4AN1zuRXWGehXV1wZHcDlMCl+7ThzSxyrZWKSoHsHYK+WmB6SMbFKJBqPli31EvBpA/kHsVbltkffvr6TRemAxCueyxwXBXD4yFWbU3h/KSzvbsd9R/g1c8+6J4w1bPpwGgO4Wb7NHRCO5AoGBAMPM7Y4E2toXlzts7YlWICVRiP8XrA5KkQ2IbG8EFGCZZjqrM8LTrmHPocFOj2aMMLxRZApxzPQc8kvYEUjEALMVQgU003WKDXVdMwoDv2CS0ejIgmAuOBFTxdLkiuQaSuVnkVOiWHxhKslKvZ1YArGA0UHkCJUi5mOXvZIj3Qe8
3998ddc4-9aba-441c-a1aa-b158c7bf1acc	cf63d1ff-3f94-4888-bb96-aa60f4641d5d	certificate	MIICmzCCAYMCBgGg6O4u0jANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjYwOTI4MTY1MDE4WhcNMzYwOTI4MTY1MTU4WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCgFiU7w64HVoytcrvG6eJJxp99TFdHBK6WoCRg+8Gbq97wLBEC0+Zkr7IWhSzixElQfR7LvrGW7DoqZgjJ5Y8O6zAAUwSYxLPtttQgfORbFudqdpzKEfLIGMxvPGzjWYhnTuSlCdbGRGGsrcMhXFkmRm829i8fHKcZQUNS4BXjL/jpQcS89QQjR9gIuu+MOaPMkcvl5ThaNskZ6AY8uEYPPN17os+lDdma3MMhguI/CuABB25pRgljGZNC6GGdoJ9MBWMPdF/Jt+lF5JY0sgzbvprdrSdlpjqsUjtb3Afy+kj/7T6JY/jb7UveyoSDzAHn+aYTjO5TWMCgFcpT5mHBAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAB9TXmhC0fxa3iNmUUsSftua3tKD+eJglSP/vLXchgJ0RL4m6dpQsiN4/XPGE1db3tI6gURLTgdGckPm9Zpq0taBO3jUhLOLMwWgO2r56be/GfYBYnqonTTkMAskZokJxjprwEhKv1GNuhkPaYAJkmrQsu3f1GLnTbJHXI8BapgVeBIzZz/7hnIctgSaCb2GI7pcnOAC/xwfhtHhq9SjSUi6XU146iQm5Gt8am5M7VUUgDF9lBo2hQbjHeI6v7cfdeFZGyqGDaXCAFvYUz+iwPC8Ps7gwcIkOinPpJdgENt/F55ZMClLPq9uBG/mZNBeK71wNGI5YlhLpgs5MpQLoXk=
d18be091-29af-4937-a590-5d905c943df1	cf63d1ff-3f94-4888-bb96-aa60f4641d5d	keyUse	SIG
e9d714ba-e289-4e31-b8b7-7eb79f012489	cf63d1ff-3f94-4888-bb96-aa60f4641d5d	priority	100
de0947f3-7c08-47f3-9429-7246a8b51805	cf63d1ff-3f94-4888-bb96-aa60f4641d5d	privateKey	MIIEogIBAAKCAQEAoBYlO8OuB1aMrXK7xuniScaffUxXRwSulqAkYPvBm6ve8CwRAtPmZK+yFoUs4sRJUH0ey76xluw6KmYIyeWPDuswAFMEmMSz7bbUIHzkWxbnanacyhHyyBjMbzxs41mIZ07kpQnWxkRhrK3DIVxZJkZvNvYvHxynGUFDUuAV4y/46UHEvPUEI0fYCLrvjDmjzJHL5eU4WjbJGegGPLhGDzzde6LPpQ3ZmtzDIYLiPwrgAQduaUYJYxmTQuhhnaCfTAVjD3RfybfpReSWNLIM276a3a0nZaY6rFI7W9wH8vpI/+0+iWP42+1L3sqEg8wB5/mmE4zuU1jAoBXKU+ZhwQIDAQABAoIBABKG6EGQa0r3c0nSO3Umiu/ViDkXZV/CD5/oYg1vVYAkq0/JvyDqpoFZ7BcQdpoP9BmCltZ8TU/q1Zh5PTnQfXamirme4gCkKIaxtWnFH9CC8r6u14Ud//u0aFnUo8LJZoXo6tacMDpl85U+eZTE0UnNYQBQDDK3ktx+DG1CTduAT2F4wScNEZO45Vlf8MHPq5yMFVHat+T+ExjojSnquXKA4Hexf4sFHVCx9HlWaDxD9WGF7AAKNPkWtb10aVz3OdRKPysUEzXApnHWml7AMoO5q3OcYtNxuM9t0uzbFla4jrBrcWGbJeCcN20FsxFZPP0J7/Lz750Iu5+CtL9e7rkCgYEA35P0SZ02n1vGxpV6FaNOBNCvSs8ysAPZ1zPOPzpohq53T8Ups1iLb5/N2BonjsAtpX+g46HwNk8Yq3iyRf6cUH61dfp9aOcO9Nc5GijRm72kbOW9JRrRAbc+XJGNBvGOKsAbiEup6zaANGmr3DfAmkoq6znQkPScWBoZfah8TPMCgYEAt00nDLzul+BI74gAT/YXhL1ixHudkdH80LiMA+empcCYRSvMGXf7ks4OrRVYcBhF6umbMHVx9lbdxmof6pD6fildCk/JaVtF37bjDmsPw9A33Uee91b83JJ6GvV9F322jPgI6jTu7UZPGIpvjCJ/EuOH86MJ10XtdkN7ffIDM3sCgYA54C37pGPQasyQ+X7J/SUkH/VQk0RWxhhtGe8I9RC71Iv0LWC3GXO26JI7n8GftWXbkqdOZcwt8tm7AZp8fgVu3O4SZU5zimSXwuL4P5rLCxN2UR5ebYuvOwU8pzzvkDYyINq/tH5+8fPMHZKshg4oooxrqeKws3GJaPAyVBwhOwKBgCXJS9F+aRj57U8jlBznuDVu7Rtf+D2FMj68rHBpoprstvcbbjmZ2EyNGc1oZxDEkDU67vjwXQvRIGq0mdu7A0hasolbpUOIw0C47NmeDGPrWnjNOOH4FqxJrc486QqcqbMptnzBaLeVFN0UPKaAvf1g1jfNVkwAaFFG3AA8kZhdAoGAM+mUWK+pHdnOSuT/4qm6vXColyTJ/4P7qC+YqyUCcCBLutEVF5oYdKAMPFdSsBYpxm1/sP+peeLqY8ATN++mTPgdZwn5rPHEEHkeSj0cWyaLJCugOV9G1l6IgTG2gWJazJKLblGdl3opBe/aYOXybFs0QIOvirXznz9nDv7i2bo=
4460581b-8c4a-4c76-84e0-208c1535f6c2	e652989b-166b-4669-a783-d4c60362df7d	algorithm	HS256
4a007334-aa4f-47ed-a886-65db12967d6f	e652989b-166b-4669-a783-d4c60362df7d	secret	friJ1_3NYJysEwkcQN40AxbMvJkGWHamRdN19hpjzEICVggb805AlTARIOJRtyeUrKMSp9VkgaXbNDrXnTISyQ
f9a2b72a-2f04-4a7c-9556-707f554d5fd5	e652989b-166b-4669-a783-d4c60362df7d	priority	100
c5ee571c-0d98-4476-a2ef-95699c87b110	e652989b-166b-4669-a783-d4c60362df7d	kid	f06d0560-2e9a-457e-87fa-4f5bf3b1786b
0b9d7fbb-0a3f-4394-b57e-52bb777dbd2c	55659481-1d02-4b6a-b09d-51e14e5711be	certificate	MIICnTCCAYUCBgGg6QvrXTANBgkqhkiG9w0BAQsFADASMRAwDgYDVQQDDAdydGtfY3JtMB4XDTI2MDkyODE3MjI0N1oXDTM2MDkyODE3MjQyN1owEjEQMA4GA1UEAwwHcnRrX2NybTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALuqc5Rz8iguv4dGT15I9E4aB/8/KMG/Oj/SdvrVjjChrLj2bJQdqDeq4Q4wKyUgZVqkd1Qse11o2nWMMNrUVRzCRBdyQYTxnYChXYErmXwbx7TdQrzsLYBNHBGQl2MDTjW+rOVW8ZwyooR4su6DWgpmODJrYkT9FaEUSQCLHxds/uCi8feiSFBdxnsv9AML7O4xyw8u9ys3h0OVPiL62PhulXZvHLoDpnGiL2tv7N4yKKHNMPtqviz15qZ+66KLUwyVjoVZZdnFoEnFCYXJ/UqPx01+Xknq4rs69uCK7D5dw76Kz2NYvXFEZUJuSNZaEteTP7teUW1deUSqRNAcHJsCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAbMc/l0Sk8zN2XrT54k/v4EuLuSaFSxH3nrxqrq6+pkl8RAKvRQoObafb90qUKNQCHPDDJ7zZ5+U5OBQ0W22yGVq7ACoobNO2lGIVfac2/sDG1NPc087CO5StN9ceJ60yVr+0d9SeM2fm9S06hBCF7mQ8cc5tCZxmsgbhyHwQYPBsG4wG5U9jHL3GGUxhXtqmp0v/ViO5nrXkMF3ou1RPg5lSrx/LrkwI3bQx1DhAYURL1B88gNx2TG/16/IiVKvy39bWFX1PIyO77IUdazm20kihpV3Gz9KCjFdwcZNXGBawMjtaAaEHpEFM/JRZmDT2pmjZlrrPwE39nfz/rFe7RA==
0dc81598-fbfb-49e7-9b79-a20d74e05b85	55659481-1d02-4b6a-b09d-51e14e5711be	keyUse	ENC
6c63f3b0-5989-4037-aadd-8405878f410f	55659481-1d02-4b6a-b09d-51e14e5711be	privateKey	MIIEpAIBAAKCAQEAu6pzlHPyKC6/h0ZPXkj0ThoH/z8owb86P9J2+tWOMKGsuPZslB2oN6rhDjArJSBlWqR3VCx7XWjadYww2tRVHMJEF3JBhPGdgKFdgSuZfBvHtN1CvOwtgE0cEZCXYwNONb6s5VbxnDKihHiy7oNaCmY4MmtiRP0VoRRJAIsfF2z+4KLx96JIUF3Gey/0Awvs7jHLDy73KzeHQ5U+IvrY+G6Vdm8cugOmcaIva2/s3jIooc0w+2q+LPXmpn7rootTDJWOhVll2cWgScUJhcn9So/HTX5eSeriuzr24IrsPl3DvorPY1i9cURlQm5I1loS15M/u15RbV15RKpE0BwcmwIDAQABAoIBAFvNHusA6PWFIMYQu+SYdYH7M+xFvi9A10K/NtqvOvZJME/uo+C0vUQ2AA/Lul9YAJydlY4EkHh6QVt9L6zsb5I46cw6ZRiehPiWd0InzNYsVL4B+pKmSf/YOKHTBGs4A7tAwh0SMfDByERbMtSARryNknH/m7u5vink3W05oQT4wuSG2LR4BS36nNjsLpCV4h01lhSrwGVbYdCoSwRPq0qKEmNTwc7rsAN2EMKe2dwBNH0SRv5m1p54bn9MfLJF2hzzjn/KamT0CsT9E+0w48Ltcb8dCvb/GGopJ/pdL+U5fA0OvEp3afW6cThOv4WJex5l6rgHpYqCOSBYToPudFkCgYEA5lb0WnjLUoFnyVjeT1gMTdAdI5MDHUJiKi6hb3+II2s9iJVwdPIA/AfYow7AGwIVfBLl/7YjFAym0/qUQ931tOU0MWPVIjsNf30zHKXL9xMH2aidW9SCa9cTueKxYne3WahopZttfV0XNsiSBQmiC46qMCWivW/HYSYhT/57FOcCgYEA0JJ73hEbs0Ri1FthqGYhQghKj37GnQNOcWdwfe0rsPlr0IXhrwjUuAr8RuiboRAckwTjLu759awlirFCRx+/e0SJhrEHW2GYsTqDNYfmcbNA0m8LPDEeFAoYQbsPQMmJpjQKPpjQ73df1y7Wx8MYuZS/DKWQinaAUj9f/jMdEC0CgYEA23js+StxqBqPNqWLpZRinN34dcYFSKLRABpQTfn5UK5FAlhJv9Q7Jemf/LX4S4Ovzvn+1qjIQblQWFjBXu0lygg+s/TIxwX3dYto4RoE/1XNvBHSZgZVgsV7ETo0BHvHYxF5LJqtN680iEmSAGTOVy7HcHrb1p6kHigDw8HZqu8CgYAFxEcQeMCfUEC7RluI4GoC/V+yX/r11GWS1R1THf+bQQouFcWLpV7cR9F51GyZI2zm07fEUG8wz7WqBASlGsecjOSQiMx/Rk+GduuxyzQf6KjeKJvS6ji+rRjGmHlvfSMFKWMvH+KG/HH17SGbHFXOq8Isg1dfvK8HlyD8UkV3cQKBgQC9YZFofNTBuayTdFvP6+k20mAvXutERDwunldmSYwywLbT7KnMOXZxtbpLXirEgd88mafGxUp6sZhWj7c+if9ySKSezvfREeahU2eZBR4+QUnrsYAo/FIToMeDM5qRHKW1gR5+4NrlhKO9g3w8k5b1VYYj6PMRpD02ROGwTTo+uA==
2e7c5a13-7eaa-445e-8e6a-acd28d8b7c5a	55659481-1d02-4b6a-b09d-51e14e5711be	algorithm	RSA-OAEP
e68c9f5e-0a80-40e0-92f0-16c90a3441dd	55659481-1d02-4b6a-b09d-51e14e5711be	priority	100
5a885320-790b-469d-8313-3fceb4fef659	93f255c8-b9db-480e-b7fa-d7197f74aec3	keyUse	SIG
30f7faa5-169e-4889-8cba-75cbf3db8b73	93f255c8-b9db-480e-b7fa-d7197f74aec3	priority	100
8a0031ca-164e-49de-9a9b-6423b7cb3665	93f255c8-b9db-480e-b7fa-d7197f74aec3	privateKey	MIIEpAIBAAKCAQEAoSyPkhW0kjwZkUiIqSiIKdWnCpCKSzXqtdzIXU/eLRhl/mk2//NevrX3N6KJE3icuXWYP+RJTSkihDKMqB6aPVzNbfnSbdeEurgPuqjtqpyootBR3ipfviX+Y5ZguZkUMK2Fo0RXHYd/7az4MeeZKu7BFrNeRw4PtN4b0o89c8Nl3uZZUbS561hkeoNmE1Oad3kty93Y7lAtfEQlNF/vT+NbvQWkNVeBLmdgeXlYImumMFTipBoY95rPoflvX6sgb3YYB6kLrB5FoEhF6cq3FR9dzcyt2KUUhmTPICA9TzQy1rptO+3fRLzgJyIOO4eVheKK+JpfsiJr6kacdZ7MOwIDAQABAoIBAEpKP+MWHiVJjn9o75UJGbouwNAdz6DbOVSab8CTD9W5aUnbNX7Eruc4+LqsMILJFXRmv8azcxYd38sPgcX8VRvzqr0Gafg3Xvax4I4pT2NU0mY5n4LIBVmgKaG9rtfdt3C4iuC2n3D9A/qJv91A41jmtBnCk7IsyRCVUD29yJWSwAhXXs9fqOKgyaPXxKzcAjvM3nhoWKRj6Osxp0nFthxKpVk7dMdskcKSFC2BGdN3mJB/dHSvr+pCnmzCLh1VmzcxwIleYDMjCQ3Bw+VrN7Tj/HWB/VSu9EdBA0ZTBi12sAedWTD4Wq7YlyuN+ORcPT8panwP0HeFy1Nd+dO5cAECgYEA0Z0vjWjJUxDJQ/HiE2GjJCZqxAiajmy3hKx2GokigGX8p4Emv1VtGlM9Phb1GRutatlo9xRKUx8dOkabiSB11G5meJf38nitNUV2TbZ430C3GOLzam7DfEAqEIaPBrrQ7aBm4U387Gs6wUhlnlwkhXkDHVNaWeGia2swILKCwNcCgYEAxNc17B+2UJjZmXGRQDbWB3iFgzWlUOgiTzE075bKc4HCWeVa+ouQsmOJ8QhNZ4euITyvIeZI9EUUShuiArnAv/alY0Y1oKVQAuygdsidh0lTPaaF2XVwKbaXZqxcf0DjkBL1cCWoLAJLSjmKOtX8z9FtLVPxRcCVIV4yCFufzz0CgYEArgJkCGs1vixQOIRjXh2OtiLiPOy7iYJ88rnMrYisSJThohhYFzwOf20ciR+7xmUwmGP1fC+u58QLmmYlFjgJORmRHYlivzoo5/FLHYZeX0808Ibu9asPw2Tsxp09vKN3b9zZqy33yjfWJcA5A7aQZvEngb/BYJ4sHCp2YJ5wZy8CgYBPA2BmxxgE5EY8nOTEVP63Av78+1S/1F6pUURBhFMB6K1eLn3Foq5TnTcq5L1FeKZCOzzFq83PF8ecM9llpLClndknr3ApaxJiCiAjbkYlnx5l2elSsBx08hF2Kmv6vM5b7/BLsyH9gHI+ejhtg6Y2uYdMsaxg5nw2Z7xHtJfCtQKBgQCLS9zFJqmm47CZX06qxikeOngPgLCkUBaL4Wm4jIzQzqX6tPIaC/Up9aZp1tikc7463Ak39e3qqwpQwQ5M8qq1gDoaH/gusRCeemK+Nyp2PpKfAdJzYRoGP54KrzZrkHAHZXzo999noq+6QebI/C+hkkVHKSmb5JEzeKofSScHrw==
6aed9b21-f0ab-4301-a695-299a08f4bc9d	93f255c8-b9db-480e-b7fa-d7197f74aec3	certificate	MIICnTCCAYUCBgGg6QvqCjANBgkqhkiG9w0BAQsFADASMRAwDgYDVQQDDAdydGtfY3JtMB4XDTI2MDkyODE3MjI0N1oXDTM2MDkyODE3MjQyN1owEjEQMA4GA1UEAwwHcnRrX2NybTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKEsj5IVtJI8GZFIiKkoiCnVpwqQiks16rXcyF1P3i0YZf5pNv/zXr619zeiiRN4nLl1mD/kSU0pIoQyjKgemj1czW350m3XhLq4D7qo7aqcqKLQUd4qX74l/mOWYLmZFDCthaNEVx2Hf+2s+DHnmSruwRazXkcOD7TeG9KPPXPDZd7mWVG0uetYZHqDZhNTmnd5Lcvd2O5QLXxEJTRf70/jW70FpDVXgS5nYHl5WCJrpjBU4qQaGPeaz6H5b1+rIG92GAepC6weRaBIRenKtxUfXc3MrdilFIZkzyAgPU80Mta6bTvt30S84CciDjuHlYXiiviaX7Iia+pGnHWezDsCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAIt+O8+8lH3CNFpCuzDNp6AE5sO6hHBii3D6PNlwx21Ox6GvPVUjKMI5T2hXb/p/CJwPxTCib+UeOsox9sEp1/mXUndiBS2bThZ6vHM2TohQ2lNqdBEGgbqpT6PbloLmf68H+j4E0PtJcpjthQ9TyQLX3quwYxn+KoUpac5UzsmjRS2mxg63xpe9beU9mBezqH8h0ocHVp+t2xjjG4cqSQDTNXWGHgf17lC3Iu7AaS62BoKvChST+FM7L9NuS6gxtaeirMLeAKfWjJ0dOPVh37GBrcPRzZyl9sC3CfhwAbgIVJPthmj1Z41mNu3kq1pQjzl2NnWenoNCe5F9dMXfTTg==
72583608-7a9a-4721-870c-26fdb44dc82d	6665bad9-6811-499c-b727-7a590cb955ee	kid	5053d957-a954-4afc-822d-81d40b54d0a2
160159b6-b31f-4dfe-ae84-c8b7420c4165	6665bad9-6811-499c-b727-7a590cb955ee	secret	csXQ0Q_OHchHHYkbFLnIYQ
7c81a78f-1aff-49fe-8e1f-1c45893e8254	6665bad9-6811-499c-b727-7a590cb955ee	priority	100
a50791f7-93fb-44dc-aa89-1d52b44afb22	e7e3deb4-12f6-41b0-b465-0539369f8705	secret	KuOoK73zEcQoHuhYweURcsCeD9fflHadw20aLJt1a-EqbqODl2vSmUBTbyLrFPDS6jE6t4kaiU70idX86tOzcQ
2e1d12d0-33e3-411b-b525-50d8c3e927b2	e7e3deb4-12f6-41b0-b465-0539369f8705	algorithm	HS256
7fbe764d-b45a-4a51-940c-25102ae94e83	e7e3deb4-12f6-41b0-b465-0539369f8705	kid	614ea7f7-dc3b-4619-9c3c-8c706f76ae4d
f62ab31d-415e-4e80-ba80-7484eae23183	e7e3deb4-12f6-41b0-b465-0539369f8705	priority	100
dc9d10dc-a2c7-42b5-8836-a1367aef71dd	76dd5a65-4f1f-4cc8-b38b-8a68e4af245c	allowed-protocol-mapper-types	saml-user-attribute-mapper
acf9010a-e2dc-4423-9a98-9eba20c5857b	76dd5a65-4f1f-4cc8-b38b-8a68e4af245c	allowed-protocol-mapper-types	oidc-address-mapper
3da16505-46f1-4b8e-a7e1-267da015f99d	76dd5a65-4f1f-4cc8-b38b-8a68e4af245c	allowed-protocol-mapper-types	saml-role-list-mapper
56698597-d307-4fd6-a26c-7710d4e97c9d	76dd5a65-4f1f-4cc8-b38b-8a68e4af245c	allowed-protocol-mapper-types	saml-user-property-mapper
e9f67a35-cd8d-4812-87e9-ca9bd8f116e0	76dd5a65-4f1f-4cc8-b38b-8a68e4af245c	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
e97712d7-192f-43b6-a5f1-dfef6eda42a6	76dd5a65-4f1f-4cc8-b38b-8a68e4af245c	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
e9b1ebcc-97e9-4d5f-89f4-b73528d7f725	76dd5a65-4f1f-4cc8-b38b-8a68e4af245c	allowed-protocol-mapper-types	oidc-full-name-mapper
06d322f2-bf23-4106-841e-30b329d0ff32	76dd5a65-4f1f-4cc8-b38b-8a68e4af245c	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
cd06dbba-ed70-4ec3-825f-06fc8ad7b474	3eb9371b-4b6c-4f6a-b07e-d2108228dceb	allow-default-scopes	true
9f6026b9-35dc-43fa-96dc-ce6c1a7c9a54	76f1a9b9-3766-4226-bc02-9fdeaad639e4	host-sending-registration-request-must-match	true
8e2623b5-af3a-4501-9593-5c2377b225d2	76f1a9b9-3766-4226-bc02-9fdeaad639e4	client-uris-must-match	true
e8228dbf-ac95-450f-a7ca-7ab629853ea4	f2c9224e-81bd-464c-aeb4-da35ea8eec9c	allowed-protocol-mapper-types	saml-user-property-mapper
b79af539-6667-4a33-9b9e-2e819f0723d2	f2c9224e-81bd-464c-aeb4-da35ea8eec9c	allowed-protocol-mapper-types	oidc-address-mapper
a8045493-e92e-4ab9-a330-2b527e5e2d0d	f2c9224e-81bd-464c-aeb4-da35ea8eec9c	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
de6ab852-c220-460d-9c59-0afee171b0c0	f2c9224e-81bd-464c-aeb4-da35ea8eec9c	allowed-protocol-mapper-types	saml-role-list-mapper
a6b22013-f4c3-4425-a628-f56900c16ada	f2c9224e-81bd-464c-aeb4-da35ea8eec9c	allowed-protocol-mapper-types	saml-user-attribute-mapper
bc846f30-86f1-4733-a41e-4ee041a22fb8	f2c9224e-81bd-464c-aeb4-da35ea8eec9c	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
05618374-6968-40c2-b8de-27d35c98bce8	f2c9224e-81bd-464c-aeb4-da35ea8eec9c	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
95b38899-35e5-4af3-88f6-877cb3928935	f2c9224e-81bd-464c-aeb4-da35ea8eec9c	allowed-protocol-mapper-types	oidc-full-name-mapper
9ccf054a-b764-4109-814a-cbef2272bc5e	1394996b-4fea-4ca3-af21-f8e33e9a527f	allow-default-scopes	true
add2cfaa-b04a-41da-98c5-df29df5a0de8	cf340d4a-4d85-45b9-b452-7f98e93120f2	max-clients	200
\.


--
-- Data for Name: composite_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.composite_role (composite, child_role) FROM stdin;
2902cfda-09ba-4d1a-a7a9-50448f3753f4	f4983b15-52b3-4050-94b7-3efba04f5e38
2902cfda-09ba-4d1a-a7a9-50448f3753f4	4c7a3696-034f-4b94-a829-ad040c9eb2a8
2902cfda-09ba-4d1a-a7a9-50448f3753f4	ad3a272f-91c4-4a68-ad67-7c87249aea51
2902cfda-09ba-4d1a-a7a9-50448f3753f4	77bff63f-b23f-469b-a5f0-eec57c9c36bd
2902cfda-09ba-4d1a-a7a9-50448f3753f4	49791f11-d959-4628-8ee4-5416aa71311e
2902cfda-09ba-4d1a-a7a9-50448f3753f4	cbaf0586-c783-4260-9413-86f620c0cb87
2902cfda-09ba-4d1a-a7a9-50448f3753f4	5e4a9051-241b-44f0-b9ac-e4117a5cfe62
2902cfda-09ba-4d1a-a7a9-50448f3753f4	3d94ccdf-605d-4b06-b615-a79d78589c02
2902cfda-09ba-4d1a-a7a9-50448f3753f4	ac7b831a-0942-4174-b10e-2ad97c2a0b48
2902cfda-09ba-4d1a-a7a9-50448f3753f4	243ffc97-ba3b-44af-80e1-8b96b1b95b9d
2902cfda-09ba-4d1a-a7a9-50448f3753f4	d7f90246-08af-4434-8081-ef51cba5e9c8
2902cfda-09ba-4d1a-a7a9-50448f3753f4	93cdb461-9c2d-4e90-9744-dbc042175dda
2902cfda-09ba-4d1a-a7a9-50448f3753f4	006ba315-e31d-4028-9f7c-cc737e8be4e5
2902cfda-09ba-4d1a-a7a9-50448f3753f4	d5a1eb6e-0e59-48ff-8d8f-49c52c5a88ae
2902cfda-09ba-4d1a-a7a9-50448f3753f4	427fe162-18c4-43a3-affb-91b57b32a0fd
2902cfda-09ba-4d1a-a7a9-50448f3753f4	f0219c0d-a9c0-4c1f-b6c3-115789a4ef08
2902cfda-09ba-4d1a-a7a9-50448f3753f4	dc6fae47-824a-4bb6-a075-04a8784406e9
2902cfda-09ba-4d1a-a7a9-50448f3753f4	1d66f7c9-015e-47c8-861f-3aeffb2d6d4e
105fddd2-2804-4f8b-b537-de76c1092fd3	f893b561-651f-4916-bafd-f92036aa0018
49791f11-d959-4628-8ee4-5416aa71311e	f0219c0d-a9c0-4c1f-b6c3-115789a4ef08
77bff63f-b23f-469b-a5f0-eec57c9c36bd	427fe162-18c4-43a3-affb-91b57b32a0fd
77bff63f-b23f-469b-a5f0-eec57c9c36bd	1d66f7c9-015e-47c8-861f-3aeffb2d6d4e
105fddd2-2804-4f8b-b537-de76c1092fd3	5501c021-14be-46dc-9b16-1ef49f7278ac
5501c021-14be-46dc-9b16-1ef49f7278ac	65fb1819-d6ff-472b-b7bb-b315e0ab4d72
23ba94d2-51f5-42bd-bc71-ac87c52dbe0a	fb905407-e7e4-4f43-ae59-0f3a916f33d2
2902cfda-09ba-4d1a-a7a9-50448f3753f4	31387a79-6cb0-4f0a-ba68-bfca306cb969
105fddd2-2804-4f8b-b537-de76c1092fd3	8120f2e5-3134-4625-86ce-204510084f2f
105fddd2-2804-4f8b-b537-de76c1092fd3	62532b23-cdb1-41ea-aeb2-a4cd6d58540b
2902cfda-09ba-4d1a-a7a9-50448f3753f4	c4cae2cc-192d-479f-9a7a-1d0dff30205a
2902cfda-09ba-4d1a-a7a9-50448f3753f4	4258559a-05cb-454e-951a-00adbe79cff7
2902cfda-09ba-4d1a-a7a9-50448f3753f4	dcb70d01-1026-471d-83be-7bb7ea5d5d0a
2902cfda-09ba-4d1a-a7a9-50448f3753f4	58c1a890-58c8-4aaf-b176-435761d0c91b
2902cfda-09ba-4d1a-a7a9-50448f3753f4	97f30817-39c6-4236-bd42-4a8b4ea3b537
2902cfda-09ba-4d1a-a7a9-50448f3753f4	7a2540a5-41b9-4b46-b2fe-c88656f96c6b
2902cfda-09ba-4d1a-a7a9-50448f3753f4	2ee72188-980b-43b0-b9da-c048b859f13a
2902cfda-09ba-4d1a-a7a9-50448f3753f4	3131e640-4171-440b-981f-ed83e91f859b
2902cfda-09ba-4d1a-a7a9-50448f3753f4	ce4a9eae-bf7b-408b-9e6c-bc7b41062f7f
2902cfda-09ba-4d1a-a7a9-50448f3753f4	94a87572-9d05-4a10-ae4e-f1d8726150cc
2902cfda-09ba-4d1a-a7a9-50448f3753f4	7585b2d4-d2e9-4691-98c6-766bfc3c76cc
2902cfda-09ba-4d1a-a7a9-50448f3753f4	8da9efba-7f7f-4311-9754-4b5dc34e5c8a
2902cfda-09ba-4d1a-a7a9-50448f3753f4	921ba4ad-665c-4f17-8d64-1095ced77926
2902cfda-09ba-4d1a-a7a9-50448f3753f4	64f0fddd-2bbe-45bd-8437-11cf7160c51b
2902cfda-09ba-4d1a-a7a9-50448f3753f4	eb94ad25-344f-4ad9-8414-4595b7747795
2902cfda-09ba-4d1a-a7a9-50448f3753f4	32069e46-e72b-4d41-891a-72f1967db1d1
2902cfda-09ba-4d1a-a7a9-50448f3753f4	4cac392f-aacb-46ce-a32e-0c0b2e4452b1
58c1a890-58c8-4aaf-b176-435761d0c91b	eb94ad25-344f-4ad9-8414-4595b7747795
dcb70d01-1026-471d-83be-7bb7ea5d5d0a	64f0fddd-2bbe-45bd-8437-11cf7160c51b
dcb70d01-1026-471d-83be-7bb7ea5d5d0a	4cac392f-aacb-46ce-a32e-0c0b2e4452b1
9825f407-4b09-4c0b-9f61-1d29d0fcb955	54e778cb-07aa-4819-baa7-d740d443cea2
9825f407-4b09-4c0b-9f61-1d29d0fcb955	436506bd-f119-47d8-b279-3c6e8a7c5fca
9825f407-4b09-4c0b-9f61-1d29d0fcb955	fca1b217-ef14-4337-9f65-7eb1adcfc0b7
9825f407-4b09-4c0b-9f61-1d29d0fcb955	5eb1b1d2-2def-42ae-8c7b-a5b96079278f
9825f407-4b09-4c0b-9f61-1d29d0fcb955	9dc6f63b-86f8-4eab-af95-4d0619cca657
9825f407-4b09-4c0b-9f61-1d29d0fcb955	695b5f3d-0a3d-484a-8ab4-2e2f90183135
9825f407-4b09-4c0b-9f61-1d29d0fcb955	1f4d93f9-73bd-47ed-9728-0245b161ff1d
9825f407-4b09-4c0b-9f61-1d29d0fcb955	393c9921-ef39-4f30-b5f7-6b3ec429bd84
9825f407-4b09-4c0b-9f61-1d29d0fcb955	cc0de28e-c6a8-4bf1-beb1-5b6fcb17ab95
9825f407-4b09-4c0b-9f61-1d29d0fcb955	cff47934-da83-452b-9130-9d91a894fe31
9825f407-4b09-4c0b-9f61-1d29d0fcb955	2ca94937-f197-48df-abc0-1205b3377e93
9825f407-4b09-4c0b-9f61-1d29d0fcb955	13cb3e0e-c774-4a38-b004-aebf733cb1a5
9825f407-4b09-4c0b-9f61-1d29d0fcb955	4b06e536-c2bf-47ed-a51a-e829d5d0bc7b
9825f407-4b09-4c0b-9f61-1d29d0fcb955	54518e43-5586-45eb-8276-ba30954bb1d8
9825f407-4b09-4c0b-9f61-1d29d0fcb955	b8bfdff6-dd39-4550-aece-1a6d5ebea28d
9825f407-4b09-4c0b-9f61-1d29d0fcb955	8b558517-4374-4edc-a77a-303852921ab3
9825f407-4b09-4c0b-9f61-1d29d0fcb955	a24b7d55-561b-4444-913d-d634899c8a5a
4f0af65a-d506-423d-9b03-d54b7177ff31	2389d08f-ee39-4bcb-bb33-1f035eaa57f9
5eb1b1d2-2def-42ae-8c7b-a5b96079278f	b8bfdff6-dd39-4550-aece-1a6d5ebea28d
fca1b217-ef14-4337-9f65-7eb1adcfc0b7	54518e43-5586-45eb-8276-ba30954bb1d8
fca1b217-ef14-4337-9f65-7eb1adcfc0b7	a24b7d55-561b-4444-913d-d634899c8a5a
4f0af65a-d506-423d-9b03-d54b7177ff31	b94780b6-07da-4fea-8cdc-bea8fc304de1
b94780b6-07da-4fea-8cdc-bea8fc304de1	bc51eb49-cb89-4acf-95f6-2ec0c9499122
d4457e97-1ecb-4b65-972e-e5d680c52a70	352f73f2-525f-4fec-9601-3b40d486319e
2902cfda-09ba-4d1a-a7a9-50448f3753f4	e76eb1ee-6b26-4589-846f-6326367b229a
9825f407-4b09-4c0b-9f61-1d29d0fcb955	ecbb3db7-04a4-4b3c-859d-ebcb32ecb146
4f0af65a-d506-423d-9b03-d54b7177ff31	5b40b904-4d2c-4bac-810a-d94c37fa7b7c
4f0af65a-d506-423d-9b03-d54b7177ff31	65e218fd-d87a-4f5a-a11b-b296cfd6bdca
\.


--
-- Data for Name: credential; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.credential (id, salt, type, user_id, created_date, user_label, secret_data, credential_data, priority) FROM stdin;
aeb1c1e4-31d9-403f-b6d6-2ed99d05143e	\N	password	30e13ebc-661f-42bf-bfc2-5672e36acf71	1790614319784	\N	{"value":"zHmQoz1QutAkPmL+bj1CM4oetgzzBNMWMtiB0xxSm9I=","salt":"AYLuVX0inl1JKCGcXqCKYA==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
c2624d74-2e7b-4c2b-b8bf-3c9c61e6c391	\N	password	012a5605-b313-49fb-b778-0d45770ffe4d	1790617963128	My password	{"value":"d2QMh5SmP6ifhqKhMQ2aDzUl9ZH1d2qXNPQQ6ZYWpKg=","salt":"pYITqW2XcXLV8LlmBNpc+w==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
9d0a68af-d82e-4416-8e3a-ac6c7416628f	\N	password	53558997-9585-44ba-9efb-76658cd32a18	1790618064770	My password	{"value":"urxwPCuFWwcmyvOI0ebMyaPB8JkFTgwnBJSecwDNRjQ=","salt":"M07OS85RsUQ6ZFdpIS6Q2w==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
0ea6805f-79b9-445f-82d4-f1615dabe203	\N	password	bbfe6dd1-1991-46aa-be18-5340a398d431	1790618083662	My password	{"value":"l/x5/XVKyjxasHN87pEEsKP0nbjSmF94O8QC8bwnqZw=","salt":"8L5XAq1FrSVmrd96V/Qyzw==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
c08996f0-9eb7-4443-a926-191e4881415d	\N	password	19f932a3-1a52-41f8-b8d4-534081a279f1	1790618114690	My password	{"value":"eW4ASjWFMMvKGxYICN4ZJreiLgTbAQH9rJM2czYwC8I=","salt":"I/C07FytvhnC0+29DkzXeg==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
ba2b98d9-ba37-40e5-8005-27b1e2d3436b	\N	password	df13a7bc-b723-41d7-9225-1e3445991a65	1790618854336	My password	{"value":"nAS3+/Ac8OBzolHjk7TDrffUJIvkgwQ/UbD0AaErLf4=","salt":"OWmLKVL0AE8bwocxnK2jEw==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
\.


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/jpa-changelog-1.0.0.Final.xml	2026-09-28 16:51:53.909489	1	EXECUTED	8:bda77d94bf90182a1e30c24f1c155ec7	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.20.0	\N	\N	0614313291
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/db2-jpa-changelog-1.0.0.Final.xml	2026-09-28 16:51:53.917914	2	MARK_RAN	8:1ecb330f30986693d1cba9ab579fa219	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.20.0	\N	\N	0614313291
1.1.0.Beta1	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Beta1.xml	2026-09-28 16:51:53.981736	3	EXECUTED	8:cb7ace19bc6d959f305605d255d4c843	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=CLIENT_ATTRIBUTES; createTable tableName=CLIENT_SESSION_NOTE; createTable tableName=APP_NODE_REGISTRATIONS; addColumn table...		\N	4.20.0	\N	\N	0614313291
1.1.0.Final	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Final.xml	2026-09-28 16:51:53.988595	4	EXECUTED	8:80230013e961310e6872e871be424a63	renameColumn newColumnName=EVENT_TIME, oldColumnName=TIME, tableName=EVENT_ENTITY		\N	4.20.0	\N	\N	0614313291
1.2.0.Beta1	psilva@redhat.com	META-INF/jpa-changelog-1.2.0.Beta1.xml	2026-09-28 16:51:54.138082	5	EXECUTED	8:67f4c20929126adc0c8e9bf48279d244	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.20.0	\N	\N	0614313291
1.2.0.Beta1	psilva@redhat.com	META-INF/db2-jpa-changelog-1.2.0.Beta1.xml	2026-09-28 16:51:54.141366	6	MARK_RAN	8:7311018b0b8179ce14628ab412bb6783	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.20.0	\N	\N	0614313291
1.2.0.RC1	bburke@redhat.com	META-INF/jpa-changelog-1.2.0.CR1.xml	2026-09-28 16:51:54.297608	7	EXECUTED	8:037ba1216c3640f8785ee6b8e7c8e3c1	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.20.0	\N	\N	0614313291
1.2.0.RC1	bburke@redhat.com	META-INF/db2-jpa-changelog-1.2.0.CR1.xml	2026-09-28 16:51:54.300327	8	MARK_RAN	8:7fe6ffe4af4df289b3157de32c624263	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.20.0	\N	\N	0614313291
1.2.0.Final	keycloak	META-INF/jpa-changelog-1.2.0.Final.xml	2026-09-28 16:51:54.310989	9	EXECUTED	8:9c136bc3187083a98745c7d03bc8a303	update tableName=CLIENT; update tableName=CLIENT; update tableName=CLIENT		\N	4.20.0	\N	\N	0614313291
1.3.0	bburke@redhat.com	META-INF/jpa-changelog-1.3.0.xml	2026-09-28 16:51:54.452493	10	EXECUTED	8:b5f09474dca81fb56a97cf5b6553d331	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=ADMI...		\N	4.20.0	\N	\N	0614313291
1.4.0	bburke@redhat.com	META-INF/jpa-changelog-1.4.0.xml	2026-09-28 16:51:54.526658	11	EXECUTED	8:ca924f31bd2a3b219fdcfe78c82dacf4	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.20.0	\N	\N	0614313291
1.4.0	bburke@redhat.com	META-INF/db2-jpa-changelog-1.4.0.xml	2026-09-28 16:51:54.528846	12	MARK_RAN	8:8acad7483e106416bcfa6f3b824a16cd	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.20.0	\N	\N	0614313291
1.5.0	bburke@redhat.com	META-INF/jpa-changelog-1.5.0.xml	2026-09-28 16:51:54.557117	13	EXECUTED	8:9b1266d17f4f87c78226f5055408fd5e	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.20.0	\N	\N	0614313291
1.6.1_from15	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-09-28 16:51:54.581429	14	EXECUTED	8:d80ec4ab6dbfe573550ff72396c7e910	addColumn tableName=REALM; addColumn tableName=KEYCLOAK_ROLE; addColumn tableName=CLIENT; createTable tableName=OFFLINE_USER_SESSION; createTable tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_US_SES_PK2, tableName=...		\N	4.20.0	\N	\N	0614313291
1.6.1_from16-pre	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-09-28 16:51:54.584034	15	MARK_RAN	8:d86eb172171e7c20b9c849b584d147b2	delete tableName=OFFLINE_CLIENT_SESSION; delete tableName=OFFLINE_USER_SESSION		\N	4.20.0	\N	\N	0614313291
1.6.1_from16	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-09-28 16:51:54.588247	16	MARK_RAN	8:5735f46f0fa60689deb0ecdc2a0dea22	dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_US_SES_PK, tableName=OFFLINE_USER_SESSION; dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_CL_SES_PK, tableName=OFFLINE_CLIENT_SESSION; addColumn tableName=OFFLINE_USER_SESSION; update tableName=OF...		\N	4.20.0	\N	\N	0614313291
1.6.1	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-09-28 16:51:54.591012	17	EXECUTED	8:d41d8cd98f00b204e9800998ecf8427e	empty		\N	4.20.0	\N	\N	0614313291
1.7.0	bburke@redhat.com	META-INF/jpa-changelog-1.7.0.xml	2026-09-28 16:51:54.652992	18	EXECUTED	8:5c1a8fd2014ac7fc43b90a700f117b23	createTable tableName=KEYCLOAK_GROUP; createTable tableName=GROUP_ROLE_MAPPING; createTable tableName=GROUP_ATTRIBUTE; createTable tableName=USER_GROUP_MEMBERSHIP; createTable tableName=REALM_DEFAULT_GROUPS; addColumn tableName=IDENTITY_PROVIDER; ...		\N	4.20.0	\N	\N	0614313291
1.8.0	mposolda@redhat.com	META-INF/jpa-changelog-1.8.0.xml	2026-09-28 16:51:54.716422	19	EXECUTED	8:1f6c2c2dfc362aff4ed75b3f0ef6b331	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.20.0	\N	\N	0614313291
1.8.0-2	keycloak	META-INF/jpa-changelog-1.8.0.xml	2026-09-28 16:51:54.723205	20	EXECUTED	8:dee9246280915712591f83a127665107	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.20.0	\N	\N	0614313291
1.8.0	mposolda@redhat.com	META-INF/db2-jpa-changelog-1.8.0.xml	2026-09-28 16:51:54.724941	21	MARK_RAN	8:9eb2ee1fa8ad1c5e426421a6f8fdfa6a	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.20.0	\N	\N	0614313291
1.8.0-2	keycloak	META-INF/db2-jpa-changelog-1.8.0.xml	2026-09-28 16:51:54.729291	22	MARK_RAN	8:dee9246280915712591f83a127665107	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.20.0	\N	\N	0614313291
1.9.0	mposolda@redhat.com	META-INF/jpa-changelog-1.9.0.xml	2026-09-28 16:51:54.770808	23	EXECUTED	8:d9fa18ffa355320395b86270680dd4fe	update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=REALM; update tableName=REALM; customChange; dr...		\N	4.20.0	\N	\N	0614313291
1.9.1	keycloak	META-INF/jpa-changelog-1.9.1.xml	2026-09-28 16:51:54.778299	24	EXECUTED	8:90cff506fedb06141ffc1c71c4a1214c	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=PUBLIC_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.20.0	\N	\N	0614313291
1.9.1	keycloak	META-INF/db2-jpa-changelog-1.9.1.xml	2026-09-28 16:51:54.780305	25	MARK_RAN	8:11a788aed4961d6d29c427c063af828c	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.20.0	\N	\N	0614313291
1.9.2	keycloak	META-INF/jpa-changelog-1.9.2.xml	2026-09-28 16:51:54.827606	26	EXECUTED	8:a4218e51e1faf380518cce2af5d39b43	createIndex indexName=IDX_USER_EMAIL, tableName=USER_ENTITY; createIndex indexName=IDX_USER_ROLE_MAPPING, tableName=USER_ROLE_MAPPING; createIndex indexName=IDX_USER_GROUP_MAPPING, tableName=USER_GROUP_MEMBERSHIP; createIndex indexName=IDX_USER_CO...		\N	4.20.0	\N	\N	0614313291
authz-2.0.0	psilva@redhat.com	META-INF/jpa-changelog-authz-2.0.0.xml	2026-09-28 16:51:54.968138	27	EXECUTED	8:d9e9a1bfaa644da9952456050f07bbdc	createTable tableName=RESOURCE_SERVER; addPrimaryKey constraintName=CONSTRAINT_FARS, tableName=RESOURCE_SERVER; addUniqueConstraint constraintName=UK_AU8TT6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER; createTable tableName=RESOURCE_SERVER_RESOU...		\N	4.20.0	\N	\N	0614313291
authz-2.5.1	psilva@redhat.com	META-INF/jpa-changelog-authz-2.5.1.xml	2026-09-28 16:51:54.972791	28	EXECUTED	8:d1bf991a6163c0acbfe664b615314505	update tableName=RESOURCE_SERVER_POLICY		\N	4.20.0	\N	\N	0614313291
2.1.0-KEYCLOAK-5461	bburke@redhat.com	META-INF/jpa-changelog-2.1.0.xml	2026-09-28 16:51:55.069256	29	EXECUTED	8:88a743a1e87ec5e30bf603da68058a8c	createTable tableName=BROKER_LINK; createTable tableName=FED_USER_ATTRIBUTE; createTable tableName=FED_USER_CONSENT; createTable tableName=FED_USER_CONSENT_ROLE; createTable tableName=FED_USER_CONSENT_PROT_MAPPER; createTable tableName=FED_USER_CR...		\N	4.20.0	\N	\N	0614313291
2.2.0	bburke@redhat.com	META-INF/jpa-changelog-2.2.0.xml	2026-09-28 16:51:55.092529	30	EXECUTED	8:c5517863c875d325dea463d00ec26d7a	addColumn tableName=ADMIN_EVENT_ENTITY; createTable tableName=CREDENTIAL_ATTRIBUTE; createTable tableName=FED_CREDENTIAL_ATTRIBUTE; modifyDataType columnName=VALUE, tableName=CREDENTIAL; addForeignKeyConstraint baseTableName=FED_CREDENTIAL_ATTRIBU...		\N	4.20.0	\N	\N	0614313291
2.3.0	bburke@redhat.com	META-INF/jpa-changelog-2.3.0.xml	2026-09-28 16:51:55.121641	31	EXECUTED	8:ada8b4833b74a498f376d7136bc7d327	createTable tableName=FEDERATED_USER; addPrimaryKey constraintName=CONSTR_FEDERATED_USER, tableName=FEDERATED_USER; dropDefaultValue columnName=TOTP, tableName=USER_ENTITY; dropColumn columnName=TOTP, tableName=USER_ENTITY; addColumn tableName=IDE...		\N	4.20.0	\N	\N	0614313291
2.4.0	bburke@redhat.com	META-INF/jpa-changelog-2.4.0.xml	2026-09-28 16:51:55.133986	32	EXECUTED	8:b9b73c8ea7299457f99fcbb825c263ba	customChange		\N	4.20.0	\N	\N	0614313291
2.5.0	bburke@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-09-28 16:51:55.147749	33	EXECUTED	8:07724333e625ccfcfc5adc63d57314f3	customChange; modifyDataType columnName=USER_ID, tableName=OFFLINE_USER_SESSION		\N	4.20.0	\N	\N	0614313291
2.5.0-unicode-oracle	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-09-28 16:51:55.151226	34	MARK_RAN	8:8b6fd445958882efe55deb26fc541a7b	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.20.0	\N	\N	0614313291
2.5.0-unicode-other-dbs	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-09-28 16:51:55.190728	35	EXECUTED	8:29b29cfebfd12600897680147277a9d7	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.20.0	\N	\N	0614313291
2.5.0-duplicate-email-support	slawomir@dabek.name	META-INF/jpa-changelog-2.5.0.xml	2026-09-28 16:51:55.196354	36	EXECUTED	8:73ad77ca8fd0410c7f9f15a471fa52bc	addColumn tableName=REALM		\N	4.20.0	\N	\N	0614313291
2.5.0-unique-group-names	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-09-28 16:51:55.206203	37	EXECUTED	8:64f27a6fdcad57f6f9153210f2ec1bdb	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.20.0	\N	\N	0614313291
2.5.1	bburke@redhat.com	META-INF/jpa-changelog-2.5.1.xml	2026-09-28 16:51:55.211923	38	EXECUTED	8:27180251182e6c31846c2ddab4bc5781	addColumn tableName=FED_USER_CONSENT		\N	4.20.0	\N	\N	0614313291
3.0.0	bburke@redhat.com	META-INF/jpa-changelog-3.0.0.xml	2026-09-28 16:51:55.220994	39	EXECUTED	8:d56f201bfcfa7a1413eb3e9bc02978f9	addColumn tableName=IDENTITY_PROVIDER		\N	4.20.0	\N	\N	0614313291
3.2.0-fix	keycloak	META-INF/jpa-changelog-3.2.0.xml	2026-09-28 16:51:55.223144	40	MARK_RAN	8:91f5522bf6afdc2077dfab57fbd3455c	addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS		\N	4.20.0	\N	\N	0614313291
3.2.0-fix-with-keycloak-5416	keycloak	META-INF/jpa-changelog-3.2.0.xml	2026-09-28 16:51:55.22915	41	MARK_RAN	8:0f01b554f256c22caeb7d8aee3a1cdc8	dropIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS; addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS; createIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS		\N	4.20.0	\N	\N	0614313291
3.2.0-fix-offline-sessions	hmlnarik	META-INF/jpa-changelog-3.2.0.xml	2026-09-28 16:51:55.240927	42	EXECUTED	8:ab91cf9cee415867ade0e2df9651a947	customChange		\N	4.20.0	\N	\N	0614313291
3.2.0-fixed	keycloak	META-INF/jpa-changelog-3.2.0.xml	2026-09-28 16:51:55.429336	43	EXECUTED	8:ceac9b1889e97d602caf373eadb0d4b7	addColumn tableName=REALM; dropPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_PK2, tableName=OFFLINE_CLIENT_SESSION; dropColumn columnName=CLIENT_SESSION_ID, tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_P...		\N	4.20.0	\N	\N	0614313291
3.3.0	keycloak	META-INF/jpa-changelog-3.3.0.xml	2026-09-28 16:51:55.437161	44	EXECUTED	8:84b986e628fe8f7fd8fd3c275c5259f2	addColumn tableName=USER_ENTITY		\N	4.20.0	\N	\N	0614313291
authz-3.4.0.CR1-resource-server-pk-change-part1	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-09-28 16:51:55.44382	45	EXECUTED	8:a164ae073c56ffdbc98a615493609a52	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_RESOURCE; addColumn tableName=RESOURCE_SERVER_SCOPE		\N	4.20.0	\N	\N	0614313291
authz-3.4.0.CR1-resource-server-pk-change-part2-KEYCLOAK-6095	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-09-28 16:51:55.461378	46	EXECUTED	8:70a2b4f1f4bd4dbf487114bdb1810e64	customChange		\N	4.20.0	\N	\N	0614313291
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-09-28 16:51:55.465722	47	MARK_RAN	8:7be68b71d2f5b94b8df2e824f2860fa2	dropIndex indexName=IDX_RES_SERV_POL_RES_SERV, tableName=RESOURCE_SERVER_POLICY; dropIndex indexName=IDX_RES_SRV_RES_RES_SRV, tableName=RESOURCE_SERVER_RESOURCE; dropIndex indexName=IDX_RES_SRV_SCOPE_RES_SRV, tableName=RESOURCE_SERVER_SCOPE		\N	4.20.0	\N	\N	0614313291
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed-nodropindex	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-09-28 16:51:55.532347	48	EXECUTED	8:bab7c631093c3861d6cf6144cd944982	addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_POLICY; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_RESOURCE; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, ...		\N	4.20.0	\N	\N	0614313291
authn-3.4.0.CR1-refresh-token-max-reuse	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-09-28 16:51:55.541217	49	EXECUTED	8:fa809ac11877d74d76fe40869916daad	addColumn tableName=REALM		\N	4.20.0	\N	\N	0614313291
3.4.0	keycloak	META-INF/jpa-changelog-3.4.0.xml	2026-09-28 16:51:55.610303	50	EXECUTED	8:fac23540a40208f5f5e326f6ceb4d291	addPrimaryKey constraintName=CONSTRAINT_REALM_DEFAULT_ROLES, tableName=REALM_DEFAULT_ROLES; addPrimaryKey constraintName=CONSTRAINT_COMPOSITE_ROLE, tableName=COMPOSITE_ROLE; addPrimaryKey constraintName=CONSTR_REALM_DEFAULT_GROUPS, tableName=REALM...		\N	4.20.0	\N	\N	0614313291
3.4.0-KEYCLOAK-5230	hmlnarik@redhat.com	META-INF/jpa-changelog-3.4.0.xml	2026-09-28 16:51:55.654907	51	EXECUTED	8:2612d1b8a97e2b5588c346e817307593	createIndex indexName=IDX_FU_ATTRIBUTE, tableName=FED_USER_ATTRIBUTE; createIndex indexName=IDX_FU_CONSENT, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CONSENT_RU, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CREDENTIAL, t...		\N	4.20.0	\N	\N	0614313291
3.4.1	psilva@redhat.com	META-INF/jpa-changelog-3.4.1.xml	2026-09-28 16:51:55.659505	52	EXECUTED	8:9842f155c5db2206c88bcb5d1046e941	modifyDataType columnName=VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.20.0	\N	\N	0614313291
3.4.2	keycloak	META-INF/jpa-changelog-3.4.2.xml	2026-09-28 16:51:55.662028	53	EXECUTED	8:2e12e06e45498406db72d5b3da5bbc76	update tableName=REALM		\N	4.20.0	\N	\N	0614313291
3.4.2-KEYCLOAK-5172	mkanis@redhat.com	META-INF/jpa-changelog-3.4.2.xml	2026-09-28 16:51:55.667188	54	EXECUTED	8:33560e7c7989250c40da3abdabdc75a4	update tableName=CLIENT		\N	4.20.0	\N	\N	0614313291
4.0.0-KEYCLOAK-6335	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-09-28 16:51:55.675873	55	EXECUTED	8:87a8d8542046817a9107c7eb9cbad1cd	createTable tableName=CLIENT_AUTH_FLOW_BINDINGS; addPrimaryKey constraintName=C_CLI_FLOW_BIND, tableName=CLIENT_AUTH_FLOW_BINDINGS		\N	4.20.0	\N	\N	0614313291
4.0.0-CLEANUP-UNUSED-TABLE	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-09-28 16:51:55.686737	56	EXECUTED	8:3ea08490a70215ed0088c273d776311e	dropTable tableName=CLIENT_IDENTITY_PROV_MAPPING		\N	4.20.0	\N	\N	0614313291
4.0.0-KEYCLOAK-6228	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-09-28 16:51:55.717963	57	EXECUTED	8:2d56697c8723d4592ab608ce14b6ed68	dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; dropNotNullConstraint columnName=CLIENT_ID, tableName=USER_CONSENT; addColumn tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHO...		\N	4.20.0	\N	\N	0614313291
4.0.0-KEYCLOAK-5579-fixed	mposolda@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-09-28 16:51:55.897713	58	EXECUTED	8:3e423e249f6068ea2bbe48bf907f9d86	dropForeignKeyConstraint baseTableName=CLIENT_TEMPLATE_ATTRIBUTES, constraintName=FK_CL_TEMPL_ATTR_TEMPL; renameTable newTableName=CLIENT_SCOPE_ATTRIBUTES, oldTableName=CLIENT_TEMPLATE_ATTRIBUTES; renameColumn newColumnName=SCOPE_ID, oldColumnName...		\N	4.20.0	\N	\N	0614313291
authz-4.0.0.CR1	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.CR1.xml	2026-09-28 16:51:55.937062	59	EXECUTED	8:15cabee5e5df0ff099510a0fc03e4103	createTable tableName=RESOURCE_SERVER_PERM_TICKET; addPrimaryKey constraintName=CONSTRAINT_FAPMT, tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRHO213XCX4WNKOG82SSPMT...		\N	4.20.0	\N	\N	0614313291
authz-4.0.0.Beta3	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.Beta3.xml	2026-09-28 16:51:55.9465	60	EXECUTED	8:4b80200af916ac54d2ffbfc47918ab0e	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRPO2128CX4WNKOG82SSRFY, referencedTableName=RESOURCE_SERVER_POLICY		\N	4.20.0	\N	\N	0614313291
authz-4.2.0.Final	mhajas@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2026-09-28 16:51:55.967075	61	EXECUTED	8:66564cd5e168045d52252c5027485bbb	createTable tableName=RESOURCE_URIS; addForeignKeyConstraint baseTableName=RESOURCE_URIS, constraintName=FK_RESOURCE_SERVER_URIS, referencedTableName=RESOURCE_SERVER_RESOURCE; customChange; dropColumn columnName=URI, tableName=RESOURCE_SERVER_RESO...		\N	4.20.0	\N	\N	0614313291
authz-4.2.0.Final-KEYCLOAK-9944	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2026-09-28 16:51:55.975197	62	EXECUTED	8:1c7064fafb030222be2bd16ccf690f6f	addPrimaryKey constraintName=CONSTRAINT_RESOUR_URIS_PK, tableName=RESOURCE_URIS		\N	4.20.0	\N	\N	0614313291
4.2.0-KEYCLOAK-6313	wadahiro@gmail.com	META-INF/jpa-changelog-4.2.0.xml	2026-09-28 16:51:55.984888	63	EXECUTED	8:2de18a0dce10cdda5c7e65c9b719b6e5	addColumn tableName=REQUIRED_ACTION_PROVIDER		\N	4.20.0	\N	\N	0614313291
4.3.0-KEYCLOAK-7984	wadahiro@gmail.com	META-INF/jpa-changelog-4.3.0.xml	2026-09-28 16:51:55.990974	64	EXECUTED	8:03e413dd182dcbd5c57e41c34d0ef682	update tableName=REQUIRED_ACTION_PROVIDER		\N	4.20.0	\N	\N	0614313291
4.6.0-KEYCLOAK-7950	psilva@redhat.com	META-INF/jpa-changelog-4.6.0.xml	2026-09-28 16:51:55.996096	65	EXECUTED	8:d27b42bb2571c18fbe3fe4e4fb7582a7	update tableName=RESOURCE_SERVER_RESOURCE		\N	4.20.0	\N	\N	0614313291
4.6.0-KEYCLOAK-8377	keycloak	META-INF/jpa-changelog-4.6.0.xml	2026-09-28 16:51:56.016493	66	EXECUTED	8:698baf84d9fd0027e9192717c2154fb8	createTable tableName=ROLE_ATTRIBUTE; addPrimaryKey constraintName=CONSTRAINT_ROLE_ATTRIBUTE_PK, tableName=ROLE_ATTRIBUTE; addForeignKeyConstraint baseTableName=ROLE_ATTRIBUTE, constraintName=FK_ROLE_ATTRIBUTE_ID, referencedTableName=KEYCLOAK_ROLE...		\N	4.20.0	\N	\N	0614313291
4.6.0-KEYCLOAK-8555	gideonray@gmail.com	META-INF/jpa-changelog-4.6.0.xml	2026-09-28 16:51:56.025631	67	EXECUTED	8:ced8822edf0f75ef26eb51582f9a821a	createIndex indexName=IDX_COMPONENT_PROVIDER_TYPE, tableName=COMPONENT		\N	4.20.0	\N	\N	0614313291
4.7.0-KEYCLOAK-1267	sguilhen@redhat.com	META-INF/jpa-changelog-4.7.0.xml	2026-09-28 16:51:56.033349	68	EXECUTED	8:f0abba004cf429e8afc43056df06487d	addColumn tableName=REALM		\N	4.20.0	\N	\N	0614313291
4.7.0-KEYCLOAK-7275	keycloak	META-INF/jpa-changelog-4.7.0.xml	2026-09-28 16:51:56.053749	69	EXECUTED	8:6662f8b0b611caa359fcf13bf63b4e24	renameColumn newColumnName=CREATED_ON, oldColumnName=LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION; addNotNullConstraint columnName=CREATED_ON, tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_USER_SESSION; customChange; createIn...		\N	4.20.0	\N	\N	0614313291
4.8.0-KEYCLOAK-8835	sguilhen@redhat.com	META-INF/jpa-changelog-4.8.0.xml	2026-09-28 16:51:56.060642	70	EXECUTED	8:9e6b8009560f684250bdbdf97670d39e	addNotNullConstraint columnName=SSO_MAX_LIFESPAN_REMEMBER_ME, tableName=REALM; addNotNullConstraint columnName=SSO_IDLE_TIMEOUT_REMEMBER_ME, tableName=REALM		\N	4.20.0	\N	\N	0614313291
authz-7.0.0-KEYCLOAK-10443	psilva@redhat.com	META-INF/jpa-changelog-authz-7.0.0.xml	2026-09-28 16:51:56.06563	71	EXECUTED	8:4223f561f3b8dc655846562b57bb502e	addColumn tableName=RESOURCE_SERVER		\N	4.20.0	\N	\N	0614313291
8.0.0-adding-credential-columns	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-09-28 16:51:56.076603	72	EXECUTED	8:215a31c398b363ce383a2b301202f29e	addColumn tableName=CREDENTIAL; addColumn tableName=FED_USER_CREDENTIAL		\N	4.20.0	\N	\N	0614313291
8.0.0-updating-credential-data-not-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-09-28 16:51:56.086838	73	EXECUTED	8:83f7a671792ca98b3cbd3a1a34862d3d	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.20.0	\N	\N	0614313291
8.0.0-updating-credential-data-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-09-28 16:51:56.089769	74	MARK_RAN	8:f58ad148698cf30707a6efbdf8061aa7	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.20.0	\N	\N	0614313291
8.0.0-credential-cleanup-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-09-28 16:51:56.130714	75	EXECUTED	8:79e4fd6c6442980e58d52ffc3ee7b19c	dropDefaultValue columnName=COUNTER, tableName=CREDENTIAL; dropDefaultValue columnName=DIGITS, tableName=CREDENTIAL; dropDefaultValue columnName=PERIOD, tableName=CREDENTIAL; dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; dropColumn ...		\N	4.20.0	\N	\N	0614313291
8.0.0-resource-tag-support	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-09-28 16:51:56.141836	76	EXECUTED	8:87af6a1e6d241ca4b15801d1f86a297d	addColumn tableName=MIGRATION_MODEL; createIndex indexName=IDX_UPDATE_TIME, tableName=MIGRATION_MODEL		\N	4.20.0	\N	\N	0614313291
9.0.0-always-display-client	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-09-28 16:51:56.148329	77	EXECUTED	8:b44f8d9b7b6ea455305a6d72a200ed15	addColumn tableName=CLIENT		\N	4.20.0	\N	\N	0614313291
9.0.0-drop-constraints-for-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-09-28 16:51:56.15184	78	MARK_RAN	8:2d8ed5aaaeffd0cb004c046b4a903ac5	dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5PMT, tableName=RESOURCE_SERVER_PERM_TICKET; dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER_RESOURCE; dropPrimaryKey constraintName=CONSTRAINT_O...		\N	4.20.0	\N	\N	0614313291
9.0.0-increase-column-size-federated-fk	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-09-28 16:51:56.187935	79	EXECUTED	8:e290c01fcbc275326c511633f6e2acde	modifyDataType columnName=CLIENT_ID, tableName=FED_USER_CONSENT; modifyDataType columnName=CLIENT_REALM_CONSTRAINT, tableName=KEYCLOAK_ROLE; modifyDataType columnName=OWNER, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=CLIENT_ID, ta...		\N	4.20.0	\N	\N	0614313291
9.0.0-recreate-constraints-after-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-09-28 16:51:56.191071	80	MARK_RAN	8:c9db8784c33cea210872ac2d805439f8	addNotNullConstraint columnName=CLIENT_ID, tableName=OFFLINE_CLIENT_SESSION; addNotNullConstraint columnName=OWNER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNullConstraint columnName=REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNull...		\N	4.20.0	\N	\N	0614313291
9.0.1-add-index-to-client.client_id	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-09-28 16:51:56.200912	81	EXECUTED	8:95b676ce8fc546a1fcfb4c92fae4add5	createIndex indexName=IDX_CLIENT_ID, tableName=CLIENT		\N	4.20.0	\N	\N	0614313291
9.0.1-KEYCLOAK-12579-drop-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-09-28 16:51:56.204223	82	MARK_RAN	8:38a6b2a41f5651018b1aca93a41401e5	dropUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.20.0	\N	\N	0614313291
9.0.1-KEYCLOAK-12579-add-not-null-constraint	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-09-28 16:51:56.214466	83	EXECUTED	8:3fb99bcad86a0229783123ac52f7609c	addNotNullConstraint columnName=PARENT_GROUP, tableName=KEYCLOAK_GROUP		\N	4.20.0	\N	\N	0614313291
9.0.1-KEYCLOAK-12579-recreate-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-09-28 16:51:56.217343	84	MARK_RAN	8:64f27a6fdcad57f6f9153210f2ec1bdb	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.20.0	\N	\N	0614313291
9.0.1-add-index-to-events	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-09-28 16:51:56.227572	85	EXECUTED	8:ab4f863f39adafd4c862f7ec01890abc	createIndex indexName=IDX_EVENT_TIME, tableName=EVENT_ENTITY		\N	4.20.0	\N	\N	0614313291
map-remove-ri	keycloak	META-INF/jpa-changelog-11.0.0.xml	2026-09-28 16:51:56.237293	86	EXECUTED	8:13c419a0eb336e91ee3a3bf8fda6e2a7	dropForeignKeyConstraint baseTableName=REALM, constraintName=FK_TRAF444KK6QRKMS7N56AIWQ5Y; dropForeignKeyConstraint baseTableName=KEYCLOAK_ROLE, constraintName=FK_KJHO5LE2C0RAL09FL8CM9WFW9		\N	4.20.0	\N	\N	0614313291
map-remove-ri	keycloak	META-INF/jpa-changelog-12.0.0.xml	2026-09-28 16:51:56.252906	87	EXECUTED	8:e3fb1e698e0471487f51af1ed80fe3ac	dropForeignKeyConstraint baseTableName=REALM_DEFAULT_GROUPS, constraintName=FK_DEF_GROUPS_GROUP; dropForeignKeyConstraint baseTableName=REALM_DEFAULT_ROLES, constraintName=FK_H4WPD7W4HSOOLNI3H0SW7BTJE; dropForeignKeyConstraint baseTableName=CLIENT...		\N	4.20.0	\N	\N	0614313291
12.1.0-add-realm-localization-table	keycloak	META-INF/jpa-changelog-12.0.0.xml	2026-09-28 16:51:56.266506	88	EXECUTED	8:babadb686aab7b56562817e60bf0abd0	createTable tableName=REALM_LOCALIZATIONS; addPrimaryKey tableName=REALM_LOCALIZATIONS		\N	4.20.0	\N	\N	0614313291
default-roles	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-28 16:51:56.280867	89	EXECUTED	8:72d03345fda8e2f17093d08801947773	addColumn tableName=REALM; customChange		\N	4.20.0	\N	\N	0614313291
default-roles-cleanup	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-28 16:51:56.297762	90	EXECUTED	8:61c9233951bd96ffecd9ba75f7d978a4	dropTable tableName=REALM_DEFAULT_ROLES; dropTable tableName=CLIENT_DEFAULT_ROLES		\N	4.20.0	\N	\N	0614313291
13.0.0-KEYCLOAK-16844	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-28 16:51:56.305981	91	EXECUTED	8:ea82e6ad945cec250af6372767b25525	createIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.20.0	\N	\N	0614313291
map-remove-ri-13.0.0	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-28 16:51:56.325213	92	EXECUTED	8:d3f4a33f41d960ddacd7e2ef30d126b3	dropForeignKeyConstraint baseTableName=DEFAULT_CLIENT_SCOPE, constraintName=FK_R_DEF_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SCOPE_CLIENT, constraintName=FK_C_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SC...		\N	4.20.0	\N	\N	0614313291
13.0.0-KEYCLOAK-17992-drop-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-28 16:51:56.327363	93	MARK_RAN	8:1284a27fbd049d65831cb6fc07c8a783	dropPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CLSCOPE_CL, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CL_CLSCOPE, tableName=CLIENT_SCOPE_CLIENT		\N	4.20.0	\N	\N	0614313291
13.0.0-increase-column-size-federated	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-28 16:51:56.347918	94	EXECUTED	8:9d11b619db2ae27c25853b8a37cd0dea	modifyDataType columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; modifyDataType columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT		\N	4.20.0	\N	\N	0614313291
13.0.0-KEYCLOAK-17992-recreate-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-28 16:51:56.350554	95	MARK_RAN	8:3002bb3997451bb9e8bac5c5cd8d6327	addNotNullConstraint columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; addNotNullConstraint columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT; addPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; createIndex indexName=...		\N	4.20.0	\N	\N	0614313291
json-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-09-28 16:51:56.361999	96	EXECUTED	8:dfbee0d6237a23ef4ccbb7a4e063c163	addColumn tableName=REALM_ATTRIBUTE; update tableName=REALM_ATTRIBUTE; dropColumn columnName=VALUE, tableName=REALM_ATTRIBUTE; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=REALM_ATTRIBUTE		\N	4.20.0	\N	\N	0614313291
14.0.0-KEYCLOAK-11019	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-28 16:51:56.379438	97	EXECUTED	8:75f3e372df18d38c62734eebb986b960	createIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USER, tableName=OFFLINE_USER_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.20.0	\N	\N	0614313291
14.0.0-KEYCLOAK-18286	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-28 16:51:56.382208	98	MARK_RAN	8:7fee73eddf84a6035691512c85637eef	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.20.0	\N	\N	0614313291
14.0.0-KEYCLOAK-18286-revert	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-28 16:51:56.397981	99	MARK_RAN	8:7a11134ab12820f999fbf3bb13c3adc8	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.20.0	\N	\N	0614313291
14.0.0-KEYCLOAK-18286-supported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-28 16:51:56.407928	100	EXECUTED	8:c0f6eaac1f3be773ffe54cb5b8482b70	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.20.0	\N	\N	0614313291
14.0.0-KEYCLOAK-18286-unsupported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-28 16:51:56.411234	101	MARK_RAN	8:18186f0008b86e0f0f49b0c4d0e842ac	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.20.0	\N	\N	0614313291
KEYCLOAK-17267-add-index-to-user-attributes	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-28 16:51:56.419842	102	EXECUTED	8:09c2780bcb23b310a7019d217dc7b433	createIndex indexName=IDX_USER_ATTRIBUTE_NAME, tableName=USER_ATTRIBUTE		\N	4.20.0	\N	\N	0614313291
KEYCLOAK-18146-add-saml-art-binding-identifier	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-09-28 16:51:56.431296	103	EXECUTED	8:276a44955eab693c970a42880197fff2	customChange		\N	4.20.0	\N	\N	0614313291
15.0.0-KEYCLOAK-18467	keycloak	META-INF/jpa-changelog-15.0.0.xml	2026-09-28 16:51:56.440518	104	EXECUTED	8:ba8ee3b694d043f2bfc1a1079d0760d7	addColumn tableName=REALM_LOCALIZATIONS; update tableName=REALM_LOCALIZATIONS; dropColumn columnName=TEXTS, tableName=REALM_LOCALIZATIONS; renameColumn newColumnName=TEXTS, oldColumnName=TEXTS_NEW, tableName=REALM_LOCALIZATIONS; addNotNullConstrai...		\N	4.20.0	\N	\N	0614313291
17.0.0-9562	keycloak	META-INF/jpa-changelog-17.0.0.xml	2026-09-28 16:51:56.450262	105	EXECUTED	8:5e06b1d75f5d17685485e610c2851b17	createIndex indexName=IDX_USER_SERVICE_ACCOUNT, tableName=USER_ENTITY		\N	4.20.0	\N	\N	0614313291
18.0.0-10625-IDX_ADMIN_EVENT_TIME	keycloak	META-INF/jpa-changelog-18.0.0.xml	2026-09-28 16:51:56.457256	106	EXECUTED	8:4b80546c1dc550ac552ee7b24a4ab7c0	createIndex indexName=IDX_ADMIN_EVENT_TIME, tableName=ADMIN_EVENT_ENTITY		\N	4.20.0	\N	\N	0614313291
19.0.0-10135	keycloak	META-INF/jpa-changelog-19.0.0.xml	2026-09-28 16:51:56.47237	107	EXECUTED	8:af510cd1bb2ab6339c45372f3e491696	customChange		\N	4.20.0	\N	\N	0614313291
20.0.0-12964-supported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-09-28 16:51:56.482953	108	EXECUTED	8:05c99fc610845ef66ee812b7921af0ef	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.20.0	\N	\N	0614313291
20.0.0-12964-unsupported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-09-28 16:51:56.486701	109	MARK_RAN	8:314e803baf2f1ec315b3464e398b8247	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.20.0	\N	\N	0614313291
client-attributes-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-09-28 16:51:56.499467	110	EXECUTED	8:56e4677e7e12556f70b604c573840100	addColumn tableName=CLIENT_ATTRIBUTES; update tableName=CLIENT_ATTRIBUTES; dropColumn columnName=VALUE, tableName=CLIENT_ATTRIBUTES; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=CLIENT_ATTRIBUTES		\N	4.20.0	\N	\N	0614313291
21.0.2-17277	keycloak	META-INF/jpa-changelog-21.0.2.xml	2026-09-28 16:51:56.509745	111	EXECUTED	8:8806cb33d2a546ce770384bf98cf6eac	customChange		\N	4.20.0	\N	\N	0614313291
21.1.0-19404	keycloak	META-INF/jpa-changelog-21.1.0.xml	2026-09-28 16:51:56.556846	112	EXECUTED	8:fdb2924649d30555ab3a1744faba4928	modifyDataType columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=LOGIC, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=POLICY_ENFORCE_MODE, tableName=RESOURCE_SERVER		\N	4.20.0	\N	\N	0614313291
21.1.0-19404-2	keycloak	META-INF/jpa-changelog-21.1.0.xml	2026-09-28 16:51:56.561129	113	MARK_RAN	8:1c96cc2b10903bd07a03670098d67fd6	addColumn tableName=RESOURCE_SERVER_POLICY; update tableName=RESOURCE_SERVER_POLICY; dropColumn columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; renameColumn newColumnName=DECISION_STRATEGY, oldColumnName=DECISION_STRATEGY_NEW, tabl...		\N	4.20.0	\N	\N	0614313291
22.0.0-17484	keycloak	META-INF/jpa-changelog-22.0.0.xml	2026-09-28 16:51:56.575941	114	EXECUTED	8:4c3d4e8b142a66fcdf21b89a4dd33301	customChange		\N	4.20.0	\N	\N	0614313291
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
1000	f	\N	\N
1001	f	\N	\N
\.


--
-- Data for Name: default_client_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.default_client_scope (realm_id, scope_id, default_scope) FROM stdin;
1d7cc020-ca7c-4805-9d61-79a209cf3578	4c90ff75-59de-48dd-89d3-3bb10580af21	f
1d7cc020-ca7c-4805-9d61-79a209cf3578	03fa8f6c-a141-4b42-9ae2-b0437139053b	t
1d7cc020-ca7c-4805-9d61-79a209cf3578	8c1e0ec1-f3d4-45b6-8324-14619440d5fd	t
1d7cc020-ca7c-4805-9d61-79a209cf3578	d253170a-f133-4c3f-ab3b-ada9aa5b4ccf	t
1d7cc020-ca7c-4805-9d61-79a209cf3578	2048bb1b-f798-4783-b77c-72224f3627ca	f
1d7cc020-ca7c-4805-9d61-79a209cf3578	4bc56cdc-cf7b-4633-b1f8-ea221c5a9576	f
1d7cc020-ca7c-4805-9d61-79a209cf3578	97ed2a8b-3705-42ae-a005-d0a56349ee58	t
1d7cc020-ca7c-4805-9d61-79a209cf3578	f78cd7d1-adb1-498a-897a-53c489b8045f	t
1d7cc020-ca7c-4805-9d61-79a209cf3578	a462462f-aa61-4d23-8039-9955eb521d5d	f
1d7cc020-ca7c-4805-9d61-79a209cf3578	bb215a29-81ad-4b99-ad82-9fb85b7bc5b5	t
f8993e77-a2d6-4198-b3cd-9ad9cde21761	4112a896-e865-4dba-9814-7d0bf0b00e6c	f
f8993e77-a2d6-4198-b3cd-9ad9cde21761	77f3dc38-56fe-4743-af3b-f8d0ff40468b	t
f8993e77-a2d6-4198-b3cd-9ad9cde21761	0339b16c-a505-4f41-93a4-04161e9e522a	t
f8993e77-a2d6-4198-b3cd-9ad9cde21761	a2dc8517-e672-479d-bff8-ab3731f6a171	t
f8993e77-a2d6-4198-b3cd-9ad9cde21761	31a35b59-b201-41b5-8679-9ff5c03137f2	f
f8993e77-a2d6-4198-b3cd-9ad9cde21761	4be0913c-3e2d-4d6f-8515-a172956218fa	f
f8993e77-a2d6-4198-b3cd-9ad9cde21761	8c74e6a0-ce32-4f60-aa23-14bae645899f	t
f8993e77-a2d6-4198-b3cd-9ad9cde21761	b909417c-0ceb-4eed-813c-e50329977475	t
f8993e77-a2d6-4198-b3cd-9ad9cde21761	ba6d589b-caa7-4389-bee3-b101fbd3554d	f
f8993e77-a2d6-4198-b3cd-9ad9cde21761	a44c4fc4-0e62-4265-ac6f-09de59422bd8	t
\.


--
-- Data for Name: event_entity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.event_entity (id, client_id, details_json, error, ip_address, realm_id, session_id, event_time, type, user_id) FROM stdin;
\.


--
-- Data for Name: fed_user_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_attribute (id, name, user_id, realm_id, storage_provider_id, value) FROM stdin;
\.


--
-- Data for Name: fed_user_consent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_consent (id, client_id, user_id, realm_id, storage_provider_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: fed_user_consent_cl_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_consent_cl_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: fed_user_credential; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_credential (id, salt, type, created_date, user_id, realm_id, storage_provider_id, user_label, secret_data, credential_data, priority) FROM stdin;
\.


--
-- Data for Name: fed_user_group_membership; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_group_membership (group_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_required_action; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_required_action (required_action, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_role_mapping (role_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: federated_identity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.federated_identity (identity_provider, realm_id, federated_user_id, federated_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: federated_user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.federated_user (id, storage_provider_id, realm_id) FROM stdin;
\.


--
-- Data for Name: group_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.group_attribute (id, name, value, group_id) FROM stdin;
\.


--
-- Data for Name: group_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.group_role_mapping (role_id, group_id) FROM stdin;
\.


--
-- Data for Name: identity_provider; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.identity_provider (internal_id, enabled, provider_alias, provider_id, store_token, authenticate_by_default, realm_id, add_token_role, trust_email, first_broker_login_flow_id, post_broker_login_flow_id, provider_display_name, link_only) FROM stdin;
\.


--
-- Data for Name: identity_provider_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.identity_provider_config (identity_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: identity_provider_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.identity_provider_mapper (id, name, idp_alias, idp_mapper_name, realm_id) FROM stdin;
\.


--
-- Data for Name: idp_mapper_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.idp_mapper_config (idp_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: keycloak_group; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.keycloak_group (id, name, parent_group, realm_id) FROM stdin;
\.


--
-- Data for Name: keycloak_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.keycloak_role (id, client_realm_constraint, client_role, description, name, realm_id, client, realm) FROM stdin;
105fddd2-2804-4f8b-b537-de76c1092fd3	1d7cc020-ca7c-4805-9d61-79a209cf3578	f	${role_default-roles}	default-roles-master	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N	\N
2902cfda-09ba-4d1a-a7a9-50448f3753f4	1d7cc020-ca7c-4805-9d61-79a209cf3578	f	${role_admin}	admin	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N	\N
f4983b15-52b3-4050-94b7-3efba04f5e38	1d7cc020-ca7c-4805-9d61-79a209cf3578	f	${role_create-realm}	create-realm	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N	\N
4c7a3696-034f-4b94-a829-ad040c9eb2a8	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_create-client}	create-client	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
ad3a272f-91c4-4a68-ad67-7c87249aea51	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_view-realm}	view-realm	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
77bff63f-b23f-469b-a5f0-eec57c9c36bd	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_view-users}	view-users	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
49791f11-d959-4628-8ee4-5416aa71311e	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_view-clients}	view-clients	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
cbaf0586-c783-4260-9413-86f620c0cb87	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_view-events}	view-events	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
5e4a9051-241b-44f0-b9ac-e4117a5cfe62	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_view-identity-providers}	view-identity-providers	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
3d94ccdf-605d-4b06-b615-a79d78589c02	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_view-authorization}	view-authorization	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
ac7b831a-0942-4174-b10e-2ad97c2a0b48	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_manage-realm}	manage-realm	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
243ffc97-ba3b-44af-80e1-8b96b1b95b9d	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_manage-users}	manage-users	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
d7f90246-08af-4434-8081-ef51cba5e9c8	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_manage-clients}	manage-clients	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
93cdb461-9c2d-4e90-9744-dbc042175dda	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_manage-events}	manage-events	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
006ba315-e31d-4028-9f7c-cc737e8be4e5	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_manage-identity-providers}	manage-identity-providers	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
d5a1eb6e-0e59-48ff-8d8f-49c52c5a88ae	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_manage-authorization}	manage-authorization	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
427fe162-18c4-43a3-affb-91b57b32a0fd	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_query-users}	query-users	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
f0219c0d-a9c0-4c1f-b6c3-115789a4ef08	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_query-clients}	query-clients	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
dc6fae47-824a-4bb6-a075-04a8784406e9	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_query-realms}	query-realms	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
1d66f7c9-015e-47c8-861f-3aeffb2d6d4e	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_query-groups}	query-groups	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
f893b561-651f-4916-bafd-f92036aa0018	d07b23c8-1068-4e2e-b24b-6201a6675145	t	${role_view-profile}	view-profile	1d7cc020-ca7c-4805-9d61-79a209cf3578	d07b23c8-1068-4e2e-b24b-6201a6675145	\N
5501c021-14be-46dc-9b16-1ef49f7278ac	d07b23c8-1068-4e2e-b24b-6201a6675145	t	${role_manage-account}	manage-account	1d7cc020-ca7c-4805-9d61-79a209cf3578	d07b23c8-1068-4e2e-b24b-6201a6675145	\N
65fb1819-d6ff-472b-b7bb-b315e0ab4d72	d07b23c8-1068-4e2e-b24b-6201a6675145	t	${role_manage-account-links}	manage-account-links	1d7cc020-ca7c-4805-9d61-79a209cf3578	d07b23c8-1068-4e2e-b24b-6201a6675145	\N
162b5dde-6f2e-4f62-abc6-d23ca07aa111	d07b23c8-1068-4e2e-b24b-6201a6675145	t	${role_view-applications}	view-applications	1d7cc020-ca7c-4805-9d61-79a209cf3578	d07b23c8-1068-4e2e-b24b-6201a6675145	\N
fb905407-e7e4-4f43-ae59-0f3a916f33d2	d07b23c8-1068-4e2e-b24b-6201a6675145	t	${role_view-consent}	view-consent	1d7cc020-ca7c-4805-9d61-79a209cf3578	d07b23c8-1068-4e2e-b24b-6201a6675145	\N
23ba94d2-51f5-42bd-bc71-ac87c52dbe0a	d07b23c8-1068-4e2e-b24b-6201a6675145	t	${role_manage-consent}	manage-consent	1d7cc020-ca7c-4805-9d61-79a209cf3578	d07b23c8-1068-4e2e-b24b-6201a6675145	\N
4a225b99-6f15-4299-a3f5-a54298a4c238	d07b23c8-1068-4e2e-b24b-6201a6675145	t	${role_view-groups}	view-groups	1d7cc020-ca7c-4805-9d61-79a209cf3578	d07b23c8-1068-4e2e-b24b-6201a6675145	\N
c6e1ed6d-a24c-4953-9163-a55a87227e58	d07b23c8-1068-4e2e-b24b-6201a6675145	t	${role_delete-account}	delete-account	1d7cc020-ca7c-4805-9d61-79a209cf3578	d07b23c8-1068-4e2e-b24b-6201a6675145	\N
2e745f55-f3e7-4c6d-a66c-265bcc71612d	2302f5ea-b322-498b-9623-9a388f82a7d7	t	${role_read-token}	read-token	1d7cc020-ca7c-4805-9d61-79a209cf3578	2302f5ea-b322-498b-9623-9a388f82a7d7	\N
31387a79-6cb0-4f0a-ba68-bfca306cb969	a97a30da-b5aa-4342-834a-bf05f3c14f17	t	${role_impersonation}	impersonation	1d7cc020-ca7c-4805-9d61-79a209cf3578	a97a30da-b5aa-4342-834a-bf05f3c14f17	\N
8120f2e5-3134-4625-86ce-204510084f2f	1d7cc020-ca7c-4805-9d61-79a209cf3578	f	${role_offline-access}	offline_access	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N	\N
62532b23-cdb1-41ea-aeb2-a4cd6d58540b	1d7cc020-ca7c-4805-9d61-79a209cf3578	f	${role_uma_authorization}	uma_authorization	1d7cc020-ca7c-4805-9d61-79a209cf3578	\N	\N
4f0af65a-d506-423d-9b03-d54b7177ff31	f8993e77-a2d6-4198-b3cd-9ad9cde21761	f	${role_default-roles}	default-roles-rtk_crm	f8993e77-a2d6-4198-b3cd-9ad9cde21761	\N	\N
c4cae2cc-192d-479f-9a7a-1d0dff30205a	42a957bc-33c2-490e-9267-dad95c330449	t	${role_create-client}	create-client	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
4258559a-05cb-454e-951a-00adbe79cff7	42a957bc-33c2-490e-9267-dad95c330449	t	${role_view-realm}	view-realm	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
dcb70d01-1026-471d-83be-7bb7ea5d5d0a	42a957bc-33c2-490e-9267-dad95c330449	t	${role_view-users}	view-users	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
58c1a890-58c8-4aaf-b176-435761d0c91b	42a957bc-33c2-490e-9267-dad95c330449	t	${role_view-clients}	view-clients	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
97f30817-39c6-4236-bd42-4a8b4ea3b537	42a957bc-33c2-490e-9267-dad95c330449	t	${role_view-events}	view-events	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
7a2540a5-41b9-4b46-b2fe-c88656f96c6b	42a957bc-33c2-490e-9267-dad95c330449	t	${role_view-identity-providers}	view-identity-providers	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
2ee72188-980b-43b0-b9da-c048b859f13a	42a957bc-33c2-490e-9267-dad95c330449	t	${role_view-authorization}	view-authorization	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
3131e640-4171-440b-981f-ed83e91f859b	42a957bc-33c2-490e-9267-dad95c330449	t	${role_manage-realm}	manage-realm	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
ce4a9eae-bf7b-408b-9e6c-bc7b41062f7f	42a957bc-33c2-490e-9267-dad95c330449	t	${role_manage-users}	manage-users	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
94a87572-9d05-4a10-ae4e-f1d8726150cc	42a957bc-33c2-490e-9267-dad95c330449	t	${role_manage-clients}	manage-clients	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
7585b2d4-d2e9-4691-98c6-766bfc3c76cc	42a957bc-33c2-490e-9267-dad95c330449	t	${role_manage-events}	manage-events	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
8da9efba-7f7f-4311-9754-4b5dc34e5c8a	42a957bc-33c2-490e-9267-dad95c330449	t	${role_manage-identity-providers}	manage-identity-providers	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
921ba4ad-665c-4f17-8d64-1095ced77926	42a957bc-33c2-490e-9267-dad95c330449	t	${role_manage-authorization}	manage-authorization	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
64f0fddd-2bbe-45bd-8437-11cf7160c51b	42a957bc-33c2-490e-9267-dad95c330449	t	${role_query-users}	query-users	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
eb94ad25-344f-4ad9-8414-4595b7747795	42a957bc-33c2-490e-9267-dad95c330449	t	${role_query-clients}	query-clients	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
32069e46-e72b-4d41-891a-72f1967db1d1	42a957bc-33c2-490e-9267-dad95c330449	t	${role_query-realms}	query-realms	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
4cac392f-aacb-46ce-a32e-0c0b2e4452b1	42a957bc-33c2-490e-9267-dad95c330449	t	${role_query-groups}	query-groups	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
9825f407-4b09-4c0b-9f61-1d29d0fcb955	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_realm-admin}	realm-admin	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
54e778cb-07aa-4819-baa7-d740d443cea2	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_create-client}	create-client	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
436506bd-f119-47d8-b279-3c6e8a7c5fca	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_view-realm}	view-realm	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
fca1b217-ef14-4337-9f65-7eb1adcfc0b7	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_view-users}	view-users	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
5eb1b1d2-2def-42ae-8c7b-a5b96079278f	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_view-clients}	view-clients	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
9dc6f63b-86f8-4eab-af95-4d0619cca657	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_view-events}	view-events	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
695b5f3d-0a3d-484a-8ab4-2e2f90183135	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_view-identity-providers}	view-identity-providers	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
1f4d93f9-73bd-47ed-9728-0245b161ff1d	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_view-authorization}	view-authorization	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
393c9921-ef39-4f30-b5f7-6b3ec429bd84	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_manage-realm}	manage-realm	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
cc0de28e-c6a8-4bf1-beb1-5b6fcb17ab95	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_manage-users}	manage-users	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
cff47934-da83-452b-9130-9d91a894fe31	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_manage-clients}	manage-clients	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
2ca94937-f197-48df-abc0-1205b3377e93	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_manage-events}	manage-events	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
13cb3e0e-c774-4a38-b004-aebf733cb1a5	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_manage-identity-providers}	manage-identity-providers	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
4b06e536-c2bf-47ed-a51a-e829d5d0bc7b	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_manage-authorization}	manage-authorization	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
54518e43-5586-45eb-8276-ba30954bb1d8	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_query-users}	query-users	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
b8bfdff6-dd39-4550-aece-1a6d5ebea28d	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_query-clients}	query-clients	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
8b558517-4374-4edc-a77a-303852921ab3	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_query-realms}	query-realms	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
a24b7d55-561b-4444-913d-d634899c8a5a	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_query-groups}	query-groups	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
2389d08f-ee39-4bcb-bb33-1f035eaa57f9	979cf5ed-59e9-4aad-9b18-de51cab7976c	t	${role_view-profile}	view-profile	f8993e77-a2d6-4198-b3cd-9ad9cde21761	979cf5ed-59e9-4aad-9b18-de51cab7976c	\N
b94780b6-07da-4fea-8cdc-bea8fc304de1	979cf5ed-59e9-4aad-9b18-de51cab7976c	t	${role_manage-account}	manage-account	f8993e77-a2d6-4198-b3cd-9ad9cde21761	979cf5ed-59e9-4aad-9b18-de51cab7976c	\N
bc51eb49-cb89-4acf-95f6-2ec0c9499122	979cf5ed-59e9-4aad-9b18-de51cab7976c	t	${role_manage-account-links}	manage-account-links	f8993e77-a2d6-4198-b3cd-9ad9cde21761	979cf5ed-59e9-4aad-9b18-de51cab7976c	\N
c5428edf-d67b-4144-9d6c-9b400f3e4a3e	979cf5ed-59e9-4aad-9b18-de51cab7976c	t	${role_view-applications}	view-applications	f8993e77-a2d6-4198-b3cd-9ad9cde21761	979cf5ed-59e9-4aad-9b18-de51cab7976c	\N
352f73f2-525f-4fec-9601-3b40d486319e	979cf5ed-59e9-4aad-9b18-de51cab7976c	t	${role_view-consent}	view-consent	f8993e77-a2d6-4198-b3cd-9ad9cde21761	979cf5ed-59e9-4aad-9b18-de51cab7976c	\N
d4457e97-1ecb-4b65-972e-e5d680c52a70	979cf5ed-59e9-4aad-9b18-de51cab7976c	t	${role_manage-consent}	manage-consent	f8993e77-a2d6-4198-b3cd-9ad9cde21761	979cf5ed-59e9-4aad-9b18-de51cab7976c	\N
e1f74728-e8c2-4914-abaa-aa423b9cf2d7	979cf5ed-59e9-4aad-9b18-de51cab7976c	t	${role_view-groups}	view-groups	f8993e77-a2d6-4198-b3cd-9ad9cde21761	979cf5ed-59e9-4aad-9b18-de51cab7976c	\N
6a183676-6009-486f-8082-7b76a1d9d5c5	979cf5ed-59e9-4aad-9b18-de51cab7976c	t	${role_delete-account}	delete-account	f8993e77-a2d6-4198-b3cd-9ad9cde21761	979cf5ed-59e9-4aad-9b18-de51cab7976c	\N
e76eb1ee-6b26-4589-846f-6326367b229a	42a957bc-33c2-490e-9267-dad95c330449	t	${role_impersonation}	impersonation	1d7cc020-ca7c-4805-9d61-79a209cf3578	42a957bc-33c2-490e-9267-dad95c330449	\N
ecbb3db7-04a4-4b3c-859d-ebcb32ecb146	002a7674-d7b3-43ff-ad90-ca181f02d51b	t	${role_impersonation}	impersonation	f8993e77-a2d6-4198-b3cd-9ad9cde21761	002a7674-d7b3-43ff-ad90-ca181f02d51b	\N
ef3ee891-f815-4eb1-bbe2-c8f104aa71f7	dcb728ea-06c0-4017-abb4-82b4ccdb4153	t	${role_read-token}	read-token	f8993e77-a2d6-4198-b3cd-9ad9cde21761	dcb728ea-06c0-4017-abb4-82b4ccdb4153	\N
5b40b904-4d2c-4bac-810a-d94c37fa7b7c	f8993e77-a2d6-4198-b3cd-9ad9cde21761	f	${role_offline-access}	offline_access	f8993e77-a2d6-4198-b3cd-9ad9cde21761	\N	\N
65e218fd-d87a-4f5a-a11b-b296cfd6bdca	f8993e77-a2d6-4198-b3cd-9ad9cde21761	f	${role_uma_authorization}	uma_authorization	f8993e77-a2d6-4198-b3cd-9ad9cde21761	\N	\N
1098a75d-ce77-4c2a-a1b4-e89069624ffa	f8993e77-a2d6-4198-b3cd-9ad9cde21761	f		Администратор	f8993e77-a2d6-4198-b3cd-9ad9cde21761	\N	\N
d00038ec-5ac1-45c8-8e2a-b70fe57c42ab	f8993e77-a2d6-4198-b3cd-9ad9cde21761	f		Пользователь	f8993e77-a2d6-4198-b3cd-9ad9cde21761	\N	\N
73838645-7120-420a-83a7-bf34e5cc0d6b	f8993e77-a2d6-4198-b3cd-9ad9cde21761	f		Руководитель	f8993e77-a2d6-4198-b3cd-9ad9cde21761	\N	\N
\.


--
-- Data for Name: migration_model; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.migration_model (id, version, update_time) FROM stdin;
hw1um	22.0.4	1790614316
\.


--
-- Data for Name: offline_client_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.offline_client_session (user_session_id, client_id, offline_flag, "timestamp", data, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: offline_user_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.offline_user_session (user_session_id, user_id, realm_id, created_on, offline_flag, data, last_session_refresh) FROM stdin;
\.


--
-- Data for Name: partnership_comments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.partnership_comments (id, partnership_id, author_id, text, created_at, stage_id) FROM stdin;
5	30	Андрей Махт	Договор подписан со стороны ректората.	2026-09-29 17:22:57.418817	14
6	31	Павел Милючихин	Провели очную презентацию учебной программы.	2026-09-29 17:22:57.422978	3
\.


--
-- Data for Name: partnership_requests; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.partnership_requests (id, requester, requester_name, university_id, program_id, status, partnership_id, decided_by, reason, created_at, decided_at) FROM stdin;
\.


--
-- Data for Name: partnership_state; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.partnership_state (partnership_id, data) FROM stdin;
29	gAAAAABqvAdpy9SglVwzKxE1TlyUhLG72UkS8U56lT4NT3wH4mJErSb9lwtV7_YTpNeQVwRDahMOoXxtB5lzJJxweNioZwb-f08pdVZloQN5j97wXqPfNOfNPc5i5BwX2Hycn3NvMOV79zNEYb9dEM4taZIDmPoJupFuWfgXDOVbLw0T5HCsr6E=
33	gAAAAABqvAdpP706TO_cWFnwbsNwJ1fzWVaEUBpnsOQqfpPnZ-US1wL3ymaWZf9zBP5Tx__pdY85DzQAGq8tC9oL9CPr97ReEquJe4RpjxkAj6hdXbIsbPBAhA3MDh-Lal0y5rK4T93klbDCMLMvphzkizt4T7VldtY-yZZ2B2Qdw1-bygVloFLzyuMMQZxxu_0SzBVUPkzboAnii8viVnTT4WTvh-wXZMxnO6BovOxAbfLksjoZz1gL40JTWUi5Eie5ZLIKfLTNn0DWuXLTYMReFZWRuB6Rq_tli-AzD3a-3cZYgJ7Ru6qdp1M7lwUMT2UIyrbTT1Ym50PH6U-iiZlH-Y-y7xgtVm-CzhFBTEnkDi-edC1JBvHeKX7jq7K_PbTtN3C4Ex-i9SwoZzAp9T7UfRwXFsN5NYdgkQY3llYcUiO2XHgO8doX1uYWeFA5vYEPb7N7N1mcSRZUX4Mdmz3EyAbGYsLrMWbwYH4LA7DxVYCF_KyyEQg=
32	gAAAAABqvAdpPCtEQBHOJs32oil-EMuhlS4R_lG4RvJhpMkFRxcKM6q4GgNkqG8LWiWUCG60OEMQzuLtqXNKbMhiqi0aOCta5Z2lKSauMaOWi8d43ByQHvij6VfBHdQkIiYYarjSC1wl_j2ot0F66hUpXvaQwyCvC3JXj16uGI6c72ErWKESTXo=
\.


--
-- Data for Name: partnerships; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.partnerships (id, university_id, program_id, stage_id, manager_name, contract_number, is_license_signed, license_term_years, comment, created_at, updated_at, transfer_status) FROM stdin;
31	43	52	3	Иван Иванов	РТК-2026/04-ПР	f	2026	Провели очную презентацию учебной программы.	2026-09-29 17:22:57.416514	2026-09-29 17:25:38.697108	В процессе передачи
30	47	51	14	Андрей Махт	ededed	f	2027	Договор подписан со стороны ректората.	2026-09-29 17:22:57.412029	2026-09-29 17:34:19.903535	Передано учреждению
29	41	49	15	ivanov	\N	f	\N	\N	2026-09-29 17:07:14.548763	2026-09-29 18:46:01.717142	\N
32	41	46	15	Андрей Махт	\N	f	\N	\N	2026-09-29 17:29:15.932224	2026-09-29 18:46:01.711601	\N
33	41	46	15	ivanov		f	\N	\N	2026-09-29 18:36:58.84278	2026-09-29 18:46:01.713905	В процессе передачи
\.


--
-- Data for Name: policy_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.policy_config (policy_id, name, value) FROM stdin;
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.programs (id, name, direction, vendor, software, priority, is_active) FROM stdin;
43	Solar Dozor		ООО «Ростелеком-Солар»	Solar Dozor	0	t
44	РТК-Платформа		ПАО «Ростелеком»	РТК-Платформа	0	t
45	РТК-Инфраструктура		ПАО «Ростелеком»	РТК-Инфраструктура	0	t
46	Кибербезопасность предприятия	Информационная безопасность			0	t
47	DevOps практики и CI/CD	DevOps			0	t
48	Администрирование облачной инфраструктуры	Облачные технологии			0	t
49	Машинное обучение и искусственный интеллект	Data Science			0	t
50	Автоматизированное тестирование ПО	QA			0	t
51	Solar Dozor: Защита от утечек	Информационная безопасность	Ростелеком-Солар	Solar Dozor	90	t
52	РТК-Платформа: Базовый DevOps	DevOps	ПАО «Ростелеком»	РТК-Платформа	85	t
53	Тестирование ПО и QA-инжиниринг	QA / Тестирование	ПАО «Ростелеком»	РТК-Автотест	70	t
54	Облачные решения и виртуализация	Cloud & Infra	Базис	Базис.Dynamix	80	t
\.


--
-- Data for Name: protocol_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.protocol_mapper (id, name, protocol, protocol_mapper_name, client_id, client_scope_id) FROM stdin;
5855d6db-0755-426c-b82f-a96ef350ccba	audience resolve	openid-connect	oidc-audience-resolve-mapper	4edd95c1-2acb-4896-92eb-697a7bb989e9	\N
a5bb6190-23fd-46a5-a116-6cc3fb24dea7	locale	openid-connect	oidc-usermodel-attribute-mapper	32903730-aa4c-4168-bfed-397484fdcb8f	\N
e4bc179c-126d-4be0-b444-795bb72f59f5	role list	saml	saml-role-list-mapper	\N	03fa8f6c-a141-4b42-9ae2-b0437139053b
9e56d05c-ae08-4500-865d-febf64e10460	full name	openid-connect	oidc-full-name-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
b7661528-6d2e-44c3-81f8-12baa9b9d8e6	family name	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
b561d230-a4a4-438d-a6f7-eff354dca59e	given name	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
0361925b-59d1-412c-a4f0-6fdf7dd3f493	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
8f1e50fa-6dd9-4d5f-98dc-0910b3dd90b4	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
d81000b0-50d2-457d-b97f-583c0ee15600	username	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
eaa80c8f-0763-44b7-b535-cebeddc5d0af	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
0979964a-b16a-4b3c-bf84-0473ce6a6946	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
9fec9fc3-7347-4782-bb5f-4b9a79d36305	website	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
db9e5d7d-adc4-4157-81c9-f79782359040	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
62fa8d03-f0ad-40af-8232-9074bc30e50e	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
42ebae92-6829-470e-b099-130c9f21d10c	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
d455b092-88eb-469a-b137-4e1085be147c	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
4b44289e-4edd-47e6-80e6-470631e4ea4c	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	8c1e0ec1-f3d4-45b6-8324-14619440d5fd
2f4f9e81-994f-4360-9c3f-bdc1e16483ed	email	openid-connect	oidc-usermodel-attribute-mapper	\N	d253170a-f133-4c3f-ab3b-ada9aa5b4ccf
624ca43f-167a-4c3d-a193-ac8858a16bcb	email verified	openid-connect	oidc-usermodel-property-mapper	\N	d253170a-f133-4c3f-ab3b-ada9aa5b4ccf
88121273-4c9d-4e9b-81f2-956faa2b8c3c	address	openid-connect	oidc-address-mapper	\N	2048bb1b-f798-4783-b77c-72224f3627ca
c4540e91-0b44-48a2-bbb8-a5ea3af91ecc	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	4bc56cdc-cf7b-4633-b1f8-ea221c5a9576
4ffb09c7-35c7-4560-9b54-a8002c71d00f	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	4bc56cdc-cf7b-4633-b1f8-ea221c5a9576
e2e7d167-fef8-43bf-a704-1c0e683b516a	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	97ed2a8b-3705-42ae-a005-d0a56349ee58
c8564bd7-8d94-4a8a-9a2c-acd4f9764991	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	97ed2a8b-3705-42ae-a005-d0a56349ee58
7b8de105-19d5-4e3d-8ef0-986c72c9da52	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	97ed2a8b-3705-42ae-a005-d0a56349ee58
a8d965d5-640d-4ecf-91d1-0a2bda34f8c5	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	f78cd7d1-adb1-498a-897a-53c489b8045f
015ca0b7-7230-4a6f-bb9d-85790ec91dd8	upn	openid-connect	oidc-usermodel-attribute-mapper	\N	a462462f-aa61-4d23-8039-9955eb521d5d
5b7cd895-f574-4016-956e-ff77c85d56c3	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	a462462f-aa61-4d23-8039-9955eb521d5d
577ca437-fdd0-46b0-a9ef-fa79f1cadca7	acr loa level	openid-connect	oidc-acr-mapper	\N	bb215a29-81ad-4b99-ad82-9fb85b7bc5b5
eded5836-28aa-4147-b9c4-463e2d3bc562	audience resolve	openid-connect	oidc-audience-resolve-mapper	62044e40-147f-440f-8b05-316c210333c0	\N
e5bcb443-5184-4488-a408-abcea83436f4	role list	saml	saml-role-list-mapper	\N	77f3dc38-56fe-4743-af3b-f8d0ff40468b
750bee9c-0077-45ad-a990-d5e4acced1c3	full name	openid-connect	oidc-full-name-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
bbd15333-9aca-4c32-9fa7-ae48b479955d	family name	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
c9c6cbe2-8f75-47ed-9299-28cb692ef23b	given name	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
2bd4ca07-113a-48d4-9c15-302c74081490	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
a5b6d04f-e10b-4999-8978-c2add6da64b0	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
a5d39a2b-1868-4e2b-9166-d6a154d9a453	username	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
3bc83be6-6f2d-458b-9847-8ec74206eb74	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
5d9d57d2-ad3a-4124-ac3c-2fee71c9df0f	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
5dacd5cd-d16e-4918-9458-ce9932cd97bf	website	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
6a4213fa-0a20-4711-b6ce-2fd13f66bfd4	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
1868f395-851a-460b-b389-aee5e0811986	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
064afc67-16cd-4b84-b36f-0923a256ccaf	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
23579b5e-c656-4cfc-bcd5-2fe63bbbd12d	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
62d7e12b-1837-41ea-a495-e778faf05ce4	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	0339b16c-a505-4f41-93a4-04161e9e522a
6da2e142-9cc6-4875-8ffa-a9827701cd2a	email	openid-connect	oidc-usermodel-attribute-mapper	\N	a2dc8517-e672-479d-bff8-ab3731f6a171
566eb286-7d35-4936-b43e-684f285dadd9	email verified	openid-connect	oidc-usermodel-property-mapper	\N	a2dc8517-e672-479d-bff8-ab3731f6a171
e452203f-2207-47d1-bf65-2c7cb1270eb6	address	openid-connect	oidc-address-mapper	\N	31a35b59-b201-41b5-8679-9ff5c03137f2
9f43430d-bfe7-45e8-a60c-a27899ab90e9	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	4be0913c-3e2d-4d6f-8515-a172956218fa
ab5fea5a-2701-4455-9df0-0d2a95b2cc87	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	4be0913c-3e2d-4d6f-8515-a172956218fa
49c3a296-ac90-40d8-9fcf-7d42f3f3ed9c	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	8c74e6a0-ce32-4f60-aa23-14bae645899f
20e1b91d-cfb3-42f8-81f6-c2c7a919ecbd	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	8c74e6a0-ce32-4f60-aa23-14bae645899f
f9d57ea2-5cf5-4067-b492-5febb9c43ac4	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	8c74e6a0-ce32-4f60-aa23-14bae645899f
015d6466-2507-4252-a1d8-6491ab359574	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	b909417c-0ceb-4eed-813c-e50329977475
e2f14317-0f34-422e-bc84-03e6f072bdc0	upn	openid-connect	oidc-usermodel-attribute-mapper	\N	ba6d589b-caa7-4389-bee3-b101fbd3554d
8fb8e86a-65c2-4dd9-84d3-d28b245a3cbb	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	ba6d589b-caa7-4389-bee3-b101fbd3554d
ac948be3-89f8-4970-939f-3095d2566c5c	acr loa level	openid-connect	oidc-acr-mapper	\N	a44c4fc4-0e62-4265-ac6f-09de59422bd8
f501cd80-4681-4b4e-8d37-57458ac3784e	locale	openid-connect	oidc-usermodel-attribute-mapper	ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	\N
\.


--
-- Data for Name: protocol_mapper_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.protocol_mapper_config (protocol_mapper_id, value, name) FROM stdin;
a5bb6190-23fd-46a5-a116-6cc3fb24dea7	true	userinfo.token.claim
a5bb6190-23fd-46a5-a116-6cc3fb24dea7	locale	user.attribute
a5bb6190-23fd-46a5-a116-6cc3fb24dea7	true	id.token.claim
a5bb6190-23fd-46a5-a116-6cc3fb24dea7	true	access.token.claim
a5bb6190-23fd-46a5-a116-6cc3fb24dea7	locale	claim.name
a5bb6190-23fd-46a5-a116-6cc3fb24dea7	String	jsonType.label
e4bc179c-126d-4be0-b444-795bb72f59f5	false	single
e4bc179c-126d-4be0-b444-795bb72f59f5	Basic	attribute.nameformat
e4bc179c-126d-4be0-b444-795bb72f59f5	Role	attribute.name
0361925b-59d1-412c-a4f0-6fdf7dd3f493	true	userinfo.token.claim
0361925b-59d1-412c-a4f0-6fdf7dd3f493	middleName	user.attribute
0361925b-59d1-412c-a4f0-6fdf7dd3f493	true	id.token.claim
0361925b-59d1-412c-a4f0-6fdf7dd3f493	true	access.token.claim
0361925b-59d1-412c-a4f0-6fdf7dd3f493	middle_name	claim.name
0361925b-59d1-412c-a4f0-6fdf7dd3f493	String	jsonType.label
0979964a-b16a-4b3c-bf84-0473ce6a6946	true	userinfo.token.claim
0979964a-b16a-4b3c-bf84-0473ce6a6946	picture	user.attribute
0979964a-b16a-4b3c-bf84-0473ce6a6946	true	id.token.claim
0979964a-b16a-4b3c-bf84-0473ce6a6946	true	access.token.claim
0979964a-b16a-4b3c-bf84-0473ce6a6946	picture	claim.name
0979964a-b16a-4b3c-bf84-0473ce6a6946	String	jsonType.label
42ebae92-6829-470e-b099-130c9f21d10c	true	userinfo.token.claim
42ebae92-6829-470e-b099-130c9f21d10c	zoneinfo	user.attribute
42ebae92-6829-470e-b099-130c9f21d10c	true	id.token.claim
42ebae92-6829-470e-b099-130c9f21d10c	true	access.token.claim
42ebae92-6829-470e-b099-130c9f21d10c	zoneinfo	claim.name
42ebae92-6829-470e-b099-130c9f21d10c	String	jsonType.label
4b44289e-4edd-47e6-80e6-470631e4ea4c	true	userinfo.token.claim
4b44289e-4edd-47e6-80e6-470631e4ea4c	updatedAt	user.attribute
4b44289e-4edd-47e6-80e6-470631e4ea4c	true	id.token.claim
4b44289e-4edd-47e6-80e6-470631e4ea4c	true	access.token.claim
4b44289e-4edd-47e6-80e6-470631e4ea4c	updated_at	claim.name
4b44289e-4edd-47e6-80e6-470631e4ea4c	long	jsonType.label
62fa8d03-f0ad-40af-8232-9074bc30e50e	true	userinfo.token.claim
62fa8d03-f0ad-40af-8232-9074bc30e50e	birthdate	user.attribute
62fa8d03-f0ad-40af-8232-9074bc30e50e	true	id.token.claim
62fa8d03-f0ad-40af-8232-9074bc30e50e	true	access.token.claim
62fa8d03-f0ad-40af-8232-9074bc30e50e	birthdate	claim.name
62fa8d03-f0ad-40af-8232-9074bc30e50e	String	jsonType.label
8f1e50fa-6dd9-4d5f-98dc-0910b3dd90b4	true	userinfo.token.claim
8f1e50fa-6dd9-4d5f-98dc-0910b3dd90b4	nickname	user.attribute
8f1e50fa-6dd9-4d5f-98dc-0910b3dd90b4	true	id.token.claim
8f1e50fa-6dd9-4d5f-98dc-0910b3dd90b4	true	access.token.claim
8f1e50fa-6dd9-4d5f-98dc-0910b3dd90b4	nickname	claim.name
8f1e50fa-6dd9-4d5f-98dc-0910b3dd90b4	String	jsonType.label
9e56d05c-ae08-4500-865d-febf64e10460	true	userinfo.token.claim
9e56d05c-ae08-4500-865d-febf64e10460	true	id.token.claim
9e56d05c-ae08-4500-865d-febf64e10460	true	access.token.claim
9fec9fc3-7347-4782-bb5f-4b9a79d36305	true	userinfo.token.claim
9fec9fc3-7347-4782-bb5f-4b9a79d36305	website	user.attribute
9fec9fc3-7347-4782-bb5f-4b9a79d36305	true	id.token.claim
9fec9fc3-7347-4782-bb5f-4b9a79d36305	true	access.token.claim
9fec9fc3-7347-4782-bb5f-4b9a79d36305	website	claim.name
9fec9fc3-7347-4782-bb5f-4b9a79d36305	String	jsonType.label
b561d230-a4a4-438d-a6f7-eff354dca59e	true	userinfo.token.claim
b561d230-a4a4-438d-a6f7-eff354dca59e	firstName	user.attribute
b561d230-a4a4-438d-a6f7-eff354dca59e	true	id.token.claim
b561d230-a4a4-438d-a6f7-eff354dca59e	true	access.token.claim
b561d230-a4a4-438d-a6f7-eff354dca59e	given_name	claim.name
b561d230-a4a4-438d-a6f7-eff354dca59e	String	jsonType.label
b7661528-6d2e-44c3-81f8-12baa9b9d8e6	true	userinfo.token.claim
b7661528-6d2e-44c3-81f8-12baa9b9d8e6	lastName	user.attribute
b7661528-6d2e-44c3-81f8-12baa9b9d8e6	true	id.token.claim
b7661528-6d2e-44c3-81f8-12baa9b9d8e6	true	access.token.claim
b7661528-6d2e-44c3-81f8-12baa9b9d8e6	family_name	claim.name
b7661528-6d2e-44c3-81f8-12baa9b9d8e6	String	jsonType.label
d455b092-88eb-469a-b137-4e1085be147c	true	userinfo.token.claim
d455b092-88eb-469a-b137-4e1085be147c	locale	user.attribute
d455b092-88eb-469a-b137-4e1085be147c	true	id.token.claim
d455b092-88eb-469a-b137-4e1085be147c	true	access.token.claim
d455b092-88eb-469a-b137-4e1085be147c	locale	claim.name
d455b092-88eb-469a-b137-4e1085be147c	String	jsonType.label
d81000b0-50d2-457d-b97f-583c0ee15600	true	userinfo.token.claim
d81000b0-50d2-457d-b97f-583c0ee15600	username	user.attribute
d81000b0-50d2-457d-b97f-583c0ee15600	true	id.token.claim
d81000b0-50d2-457d-b97f-583c0ee15600	true	access.token.claim
d81000b0-50d2-457d-b97f-583c0ee15600	preferred_username	claim.name
d81000b0-50d2-457d-b97f-583c0ee15600	String	jsonType.label
db9e5d7d-adc4-4157-81c9-f79782359040	true	userinfo.token.claim
db9e5d7d-adc4-4157-81c9-f79782359040	gender	user.attribute
db9e5d7d-adc4-4157-81c9-f79782359040	true	id.token.claim
db9e5d7d-adc4-4157-81c9-f79782359040	true	access.token.claim
db9e5d7d-adc4-4157-81c9-f79782359040	gender	claim.name
db9e5d7d-adc4-4157-81c9-f79782359040	String	jsonType.label
eaa80c8f-0763-44b7-b535-cebeddc5d0af	true	userinfo.token.claim
eaa80c8f-0763-44b7-b535-cebeddc5d0af	profile	user.attribute
eaa80c8f-0763-44b7-b535-cebeddc5d0af	true	id.token.claim
eaa80c8f-0763-44b7-b535-cebeddc5d0af	true	access.token.claim
eaa80c8f-0763-44b7-b535-cebeddc5d0af	profile	claim.name
eaa80c8f-0763-44b7-b535-cebeddc5d0af	String	jsonType.label
2f4f9e81-994f-4360-9c3f-bdc1e16483ed	true	userinfo.token.claim
2f4f9e81-994f-4360-9c3f-bdc1e16483ed	email	user.attribute
2f4f9e81-994f-4360-9c3f-bdc1e16483ed	true	id.token.claim
2f4f9e81-994f-4360-9c3f-bdc1e16483ed	true	access.token.claim
2f4f9e81-994f-4360-9c3f-bdc1e16483ed	email	claim.name
2f4f9e81-994f-4360-9c3f-bdc1e16483ed	String	jsonType.label
624ca43f-167a-4c3d-a193-ac8858a16bcb	true	userinfo.token.claim
624ca43f-167a-4c3d-a193-ac8858a16bcb	emailVerified	user.attribute
624ca43f-167a-4c3d-a193-ac8858a16bcb	true	id.token.claim
624ca43f-167a-4c3d-a193-ac8858a16bcb	true	access.token.claim
624ca43f-167a-4c3d-a193-ac8858a16bcb	email_verified	claim.name
624ca43f-167a-4c3d-a193-ac8858a16bcb	boolean	jsonType.label
88121273-4c9d-4e9b-81f2-956faa2b8c3c	formatted	user.attribute.formatted
88121273-4c9d-4e9b-81f2-956faa2b8c3c	country	user.attribute.country
88121273-4c9d-4e9b-81f2-956faa2b8c3c	postal_code	user.attribute.postal_code
88121273-4c9d-4e9b-81f2-956faa2b8c3c	true	userinfo.token.claim
88121273-4c9d-4e9b-81f2-956faa2b8c3c	street	user.attribute.street
88121273-4c9d-4e9b-81f2-956faa2b8c3c	true	id.token.claim
88121273-4c9d-4e9b-81f2-956faa2b8c3c	region	user.attribute.region
88121273-4c9d-4e9b-81f2-956faa2b8c3c	true	access.token.claim
88121273-4c9d-4e9b-81f2-956faa2b8c3c	locality	user.attribute.locality
4ffb09c7-35c7-4560-9b54-a8002c71d00f	true	userinfo.token.claim
4ffb09c7-35c7-4560-9b54-a8002c71d00f	phoneNumberVerified	user.attribute
4ffb09c7-35c7-4560-9b54-a8002c71d00f	true	id.token.claim
4ffb09c7-35c7-4560-9b54-a8002c71d00f	true	access.token.claim
4ffb09c7-35c7-4560-9b54-a8002c71d00f	phone_number_verified	claim.name
4ffb09c7-35c7-4560-9b54-a8002c71d00f	boolean	jsonType.label
c4540e91-0b44-48a2-bbb8-a5ea3af91ecc	true	userinfo.token.claim
c4540e91-0b44-48a2-bbb8-a5ea3af91ecc	phoneNumber	user.attribute
c4540e91-0b44-48a2-bbb8-a5ea3af91ecc	true	id.token.claim
c4540e91-0b44-48a2-bbb8-a5ea3af91ecc	true	access.token.claim
c4540e91-0b44-48a2-bbb8-a5ea3af91ecc	phone_number	claim.name
c4540e91-0b44-48a2-bbb8-a5ea3af91ecc	String	jsonType.label
c8564bd7-8d94-4a8a-9a2c-acd4f9764991	true	multivalued
c8564bd7-8d94-4a8a-9a2c-acd4f9764991	foo	user.attribute
c8564bd7-8d94-4a8a-9a2c-acd4f9764991	true	access.token.claim
c8564bd7-8d94-4a8a-9a2c-acd4f9764991	resource_access.${client_id}.roles	claim.name
c8564bd7-8d94-4a8a-9a2c-acd4f9764991	String	jsonType.label
e2e7d167-fef8-43bf-a704-1c0e683b516a	true	multivalued
e2e7d167-fef8-43bf-a704-1c0e683b516a	foo	user.attribute
e2e7d167-fef8-43bf-a704-1c0e683b516a	true	access.token.claim
e2e7d167-fef8-43bf-a704-1c0e683b516a	realm_access.roles	claim.name
e2e7d167-fef8-43bf-a704-1c0e683b516a	String	jsonType.label
015ca0b7-7230-4a6f-bb9d-85790ec91dd8	true	userinfo.token.claim
015ca0b7-7230-4a6f-bb9d-85790ec91dd8	username	user.attribute
015ca0b7-7230-4a6f-bb9d-85790ec91dd8	true	id.token.claim
015ca0b7-7230-4a6f-bb9d-85790ec91dd8	true	access.token.claim
015ca0b7-7230-4a6f-bb9d-85790ec91dd8	upn	claim.name
015ca0b7-7230-4a6f-bb9d-85790ec91dd8	String	jsonType.label
5b7cd895-f574-4016-956e-ff77c85d56c3	true	multivalued
5b7cd895-f574-4016-956e-ff77c85d56c3	foo	user.attribute
5b7cd895-f574-4016-956e-ff77c85d56c3	true	id.token.claim
5b7cd895-f574-4016-956e-ff77c85d56c3	true	access.token.claim
5b7cd895-f574-4016-956e-ff77c85d56c3	groups	claim.name
5b7cd895-f574-4016-956e-ff77c85d56c3	String	jsonType.label
577ca437-fdd0-46b0-a9ef-fa79f1cadca7	true	id.token.claim
577ca437-fdd0-46b0-a9ef-fa79f1cadca7	true	access.token.claim
e5bcb443-5184-4488-a408-abcea83436f4	false	single
e5bcb443-5184-4488-a408-abcea83436f4	Basic	attribute.nameformat
e5bcb443-5184-4488-a408-abcea83436f4	Role	attribute.name
064afc67-16cd-4b84-b36f-0923a256ccaf	true	userinfo.token.claim
064afc67-16cd-4b84-b36f-0923a256ccaf	zoneinfo	user.attribute
064afc67-16cd-4b84-b36f-0923a256ccaf	true	id.token.claim
064afc67-16cd-4b84-b36f-0923a256ccaf	true	access.token.claim
064afc67-16cd-4b84-b36f-0923a256ccaf	zoneinfo	claim.name
064afc67-16cd-4b84-b36f-0923a256ccaf	String	jsonType.label
1868f395-851a-460b-b389-aee5e0811986	true	userinfo.token.claim
1868f395-851a-460b-b389-aee5e0811986	birthdate	user.attribute
1868f395-851a-460b-b389-aee5e0811986	true	id.token.claim
1868f395-851a-460b-b389-aee5e0811986	true	access.token.claim
1868f395-851a-460b-b389-aee5e0811986	birthdate	claim.name
1868f395-851a-460b-b389-aee5e0811986	String	jsonType.label
23579b5e-c656-4cfc-bcd5-2fe63bbbd12d	true	userinfo.token.claim
23579b5e-c656-4cfc-bcd5-2fe63bbbd12d	locale	user.attribute
23579b5e-c656-4cfc-bcd5-2fe63bbbd12d	true	id.token.claim
23579b5e-c656-4cfc-bcd5-2fe63bbbd12d	true	access.token.claim
23579b5e-c656-4cfc-bcd5-2fe63bbbd12d	locale	claim.name
23579b5e-c656-4cfc-bcd5-2fe63bbbd12d	String	jsonType.label
2bd4ca07-113a-48d4-9c15-302c74081490	true	userinfo.token.claim
2bd4ca07-113a-48d4-9c15-302c74081490	middleName	user.attribute
2bd4ca07-113a-48d4-9c15-302c74081490	true	id.token.claim
2bd4ca07-113a-48d4-9c15-302c74081490	true	access.token.claim
2bd4ca07-113a-48d4-9c15-302c74081490	middle_name	claim.name
2bd4ca07-113a-48d4-9c15-302c74081490	String	jsonType.label
3bc83be6-6f2d-458b-9847-8ec74206eb74	true	userinfo.token.claim
3bc83be6-6f2d-458b-9847-8ec74206eb74	profile	user.attribute
3bc83be6-6f2d-458b-9847-8ec74206eb74	true	id.token.claim
3bc83be6-6f2d-458b-9847-8ec74206eb74	true	access.token.claim
3bc83be6-6f2d-458b-9847-8ec74206eb74	profile	claim.name
3bc83be6-6f2d-458b-9847-8ec74206eb74	String	jsonType.label
5d9d57d2-ad3a-4124-ac3c-2fee71c9df0f	true	userinfo.token.claim
5d9d57d2-ad3a-4124-ac3c-2fee71c9df0f	picture	user.attribute
5d9d57d2-ad3a-4124-ac3c-2fee71c9df0f	true	id.token.claim
5d9d57d2-ad3a-4124-ac3c-2fee71c9df0f	true	access.token.claim
5d9d57d2-ad3a-4124-ac3c-2fee71c9df0f	picture	claim.name
5d9d57d2-ad3a-4124-ac3c-2fee71c9df0f	String	jsonType.label
5dacd5cd-d16e-4918-9458-ce9932cd97bf	true	userinfo.token.claim
5dacd5cd-d16e-4918-9458-ce9932cd97bf	website	user.attribute
5dacd5cd-d16e-4918-9458-ce9932cd97bf	true	id.token.claim
5dacd5cd-d16e-4918-9458-ce9932cd97bf	true	access.token.claim
5dacd5cd-d16e-4918-9458-ce9932cd97bf	website	claim.name
5dacd5cd-d16e-4918-9458-ce9932cd97bf	String	jsonType.label
62d7e12b-1837-41ea-a495-e778faf05ce4	true	userinfo.token.claim
62d7e12b-1837-41ea-a495-e778faf05ce4	updatedAt	user.attribute
62d7e12b-1837-41ea-a495-e778faf05ce4	true	id.token.claim
62d7e12b-1837-41ea-a495-e778faf05ce4	true	access.token.claim
62d7e12b-1837-41ea-a495-e778faf05ce4	updated_at	claim.name
62d7e12b-1837-41ea-a495-e778faf05ce4	long	jsonType.label
6a4213fa-0a20-4711-b6ce-2fd13f66bfd4	true	userinfo.token.claim
6a4213fa-0a20-4711-b6ce-2fd13f66bfd4	gender	user.attribute
6a4213fa-0a20-4711-b6ce-2fd13f66bfd4	true	id.token.claim
6a4213fa-0a20-4711-b6ce-2fd13f66bfd4	true	access.token.claim
6a4213fa-0a20-4711-b6ce-2fd13f66bfd4	gender	claim.name
6a4213fa-0a20-4711-b6ce-2fd13f66bfd4	String	jsonType.label
750bee9c-0077-45ad-a990-d5e4acced1c3	true	userinfo.token.claim
750bee9c-0077-45ad-a990-d5e4acced1c3	true	id.token.claim
750bee9c-0077-45ad-a990-d5e4acced1c3	true	access.token.claim
a5b6d04f-e10b-4999-8978-c2add6da64b0	true	userinfo.token.claim
a5b6d04f-e10b-4999-8978-c2add6da64b0	nickname	user.attribute
a5b6d04f-e10b-4999-8978-c2add6da64b0	true	id.token.claim
a5b6d04f-e10b-4999-8978-c2add6da64b0	true	access.token.claim
a5b6d04f-e10b-4999-8978-c2add6da64b0	nickname	claim.name
a5b6d04f-e10b-4999-8978-c2add6da64b0	String	jsonType.label
a5d39a2b-1868-4e2b-9166-d6a154d9a453	true	userinfo.token.claim
a5d39a2b-1868-4e2b-9166-d6a154d9a453	username	user.attribute
a5d39a2b-1868-4e2b-9166-d6a154d9a453	true	id.token.claim
a5d39a2b-1868-4e2b-9166-d6a154d9a453	true	access.token.claim
a5d39a2b-1868-4e2b-9166-d6a154d9a453	preferred_username	claim.name
a5d39a2b-1868-4e2b-9166-d6a154d9a453	String	jsonType.label
bbd15333-9aca-4c32-9fa7-ae48b479955d	true	userinfo.token.claim
bbd15333-9aca-4c32-9fa7-ae48b479955d	lastName	user.attribute
bbd15333-9aca-4c32-9fa7-ae48b479955d	true	id.token.claim
bbd15333-9aca-4c32-9fa7-ae48b479955d	true	access.token.claim
bbd15333-9aca-4c32-9fa7-ae48b479955d	family_name	claim.name
bbd15333-9aca-4c32-9fa7-ae48b479955d	String	jsonType.label
c9c6cbe2-8f75-47ed-9299-28cb692ef23b	true	userinfo.token.claim
c9c6cbe2-8f75-47ed-9299-28cb692ef23b	firstName	user.attribute
c9c6cbe2-8f75-47ed-9299-28cb692ef23b	true	id.token.claim
c9c6cbe2-8f75-47ed-9299-28cb692ef23b	true	access.token.claim
c9c6cbe2-8f75-47ed-9299-28cb692ef23b	given_name	claim.name
c9c6cbe2-8f75-47ed-9299-28cb692ef23b	String	jsonType.label
566eb286-7d35-4936-b43e-684f285dadd9	true	userinfo.token.claim
566eb286-7d35-4936-b43e-684f285dadd9	emailVerified	user.attribute
566eb286-7d35-4936-b43e-684f285dadd9	true	id.token.claim
566eb286-7d35-4936-b43e-684f285dadd9	true	access.token.claim
566eb286-7d35-4936-b43e-684f285dadd9	email_verified	claim.name
566eb286-7d35-4936-b43e-684f285dadd9	boolean	jsonType.label
6da2e142-9cc6-4875-8ffa-a9827701cd2a	true	userinfo.token.claim
6da2e142-9cc6-4875-8ffa-a9827701cd2a	email	user.attribute
6da2e142-9cc6-4875-8ffa-a9827701cd2a	true	id.token.claim
6da2e142-9cc6-4875-8ffa-a9827701cd2a	true	access.token.claim
6da2e142-9cc6-4875-8ffa-a9827701cd2a	email	claim.name
6da2e142-9cc6-4875-8ffa-a9827701cd2a	String	jsonType.label
e452203f-2207-47d1-bf65-2c7cb1270eb6	formatted	user.attribute.formatted
e452203f-2207-47d1-bf65-2c7cb1270eb6	country	user.attribute.country
e452203f-2207-47d1-bf65-2c7cb1270eb6	postal_code	user.attribute.postal_code
e452203f-2207-47d1-bf65-2c7cb1270eb6	true	userinfo.token.claim
e452203f-2207-47d1-bf65-2c7cb1270eb6	street	user.attribute.street
e452203f-2207-47d1-bf65-2c7cb1270eb6	true	id.token.claim
e452203f-2207-47d1-bf65-2c7cb1270eb6	region	user.attribute.region
e452203f-2207-47d1-bf65-2c7cb1270eb6	true	access.token.claim
e452203f-2207-47d1-bf65-2c7cb1270eb6	locality	user.attribute.locality
9f43430d-bfe7-45e8-a60c-a27899ab90e9	true	userinfo.token.claim
9f43430d-bfe7-45e8-a60c-a27899ab90e9	phoneNumber	user.attribute
9f43430d-bfe7-45e8-a60c-a27899ab90e9	true	id.token.claim
9f43430d-bfe7-45e8-a60c-a27899ab90e9	true	access.token.claim
9f43430d-bfe7-45e8-a60c-a27899ab90e9	phone_number	claim.name
9f43430d-bfe7-45e8-a60c-a27899ab90e9	String	jsonType.label
ab5fea5a-2701-4455-9df0-0d2a95b2cc87	true	userinfo.token.claim
ab5fea5a-2701-4455-9df0-0d2a95b2cc87	phoneNumberVerified	user.attribute
ab5fea5a-2701-4455-9df0-0d2a95b2cc87	true	id.token.claim
ab5fea5a-2701-4455-9df0-0d2a95b2cc87	true	access.token.claim
ab5fea5a-2701-4455-9df0-0d2a95b2cc87	phone_number_verified	claim.name
ab5fea5a-2701-4455-9df0-0d2a95b2cc87	boolean	jsonType.label
20e1b91d-cfb3-42f8-81f6-c2c7a919ecbd	true	multivalued
20e1b91d-cfb3-42f8-81f6-c2c7a919ecbd	foo	user.attribute
20e1b91d-cfb3-42f8-81f6-c2c7a919ecbd	true	access.token.claim
20e1b91d-cfb3-42f8-81f6-c2c7a919ecbd	resource_access.${client_id}.roles	claim.name
20e1b91d-cfb3-42f8-81f6-c2c7a919ecbd	String	jsonType.label
49c3a296-ac90-40d8-9fcf-7d42f3f3ed9c	true	multivalued
49c3a296-ac90-40d8-9fcf-7d42f3f3ed9c	foo	user.attribute
49c3a296-ac90-40d8-9fcf-7d42f3f3ed9c	true	access.token.claim
49c3a296-ac90-40d8-9fcf-7d42f3f3ed9c	realm_access.roles	claim.name
49c3a296-ac90-40d8-9fcf-7d42f3f3ed9c	String	jsonType.label
8fb8e86a-65c2-4dd9-84d3-d28b245a3cbb	true	multivalued
8fb8e86a-65c2-4dd9-84d3-d28b245a3cbb	foo	user.attribute
8fb8e86a-65c2-4dd9-84d3-d28b245a3cbb	true	id.token.claim
8fb8e86a-65c2-4dd9-84d3-d28b245a3cbb	true	access.token.claim
8fb8e86a-65c2-4dd9-84d3-d28b245a3cbb	groups	claim.name
8fb8e86a-65c2-4dd9-84d3-d28b245a3cbb	String	jsonType.label
e2f14317-0f34-422e-bc84-03e6f072bdc0	true	userinfo.token.claim
e2f14317-0f34-422e-bc84-03e6f072bdc0	username	user.attribute
e2f14317-0f34-422e-bc84-03e6f072bdc0	true	id.token.claim
e2f14317-0f34-422e-bc84-03e6f072bdc0	true	access.token.claim
e2f14317-0f34-422e-bc84-03e6f072bdc0	upn	claim.name
e2f14317-0f34-422e-bc84-03e6f072bdc0	String	jsonType.label
ac948be3-89f8-4970-939f-3095d2566c5c	true	id.token.claim
ac948be3-89f8-4970-939f-3095d2566c5c	true	access.token.claim
f501cd80-4681-4b4e-8d37-57458ac3784e	true	userinfo.token.claim
f501cd80-4681-4b4e-8d37-57458ac3784e	locale	user.attribute
f501cd80-4681-4b4e-8d37-57458ac3784e	true	id.token.claim
f501cd80-4681-4b4e-8d37-57458ac3784e	true	access.token.claim
f501cd80-4681-4b4e-8d37-57458ac3784e	locale	claim.name
f501cd80-4681-4b4e-8d37-57458ac3784e	String	jsonType.label
\.


--
-- Data for Name: realm; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm (id, access_code_lifespan, user_action_lifespan, access_token_lifespan, account_theme, admin_theme, email_theme, enabled, events_enabled, events_expiration, login_theme, name, not_before, password_policy, registration_allowed, remember_me, reset_password_allowed, social, ssl_required, sso_idle_timeout, sso_max_lifespan, update_profile_on_soc_login, verify_email, master_admin_client, login_lifespan, internationalization_enabled, default_locale, reg_email_as_username, admin_events_enabled, admin_events_details_enabled, edit_username_allowed, otp_policy_counter, otp_policy_window, otp_policy_period, otp_policy_digits, otp_policy_alg, otp_policy_type, browser_flow, registration_flow, direct_grant_flow, reset_credentials_flow, client_auth_flow, offline_session_idle_timeout, revoke_refresh_token, access_token_life_implicit, login_with_email_allowed, duplicate_emails_allowed, docker_auth_flow, refresh_token_max_reuse, allow_user_managed_access, sso_max_lifespan_remember_me, sso_idle_timeout_remember_me, default_role) FROM stdin;
f8993e77-a2d6-4198-b3cd-9ad9cde21761	60	300	86400	\N	\N	\N	t	f	0	\N	rtk_crm	0	\N	f	f	f	f	EXTERNAL	86400	86400	f	f	42a957bc-33c2-490e-9267-dad95c330449	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	b9464eae-66b6-4d68-8d8d-b0a1a0e24cde	859451b2-85d6-48c1-abe9-bd4d47e79b61	06f68501-054d-404c-9209-06d2f08b8949	79ecaba9-185c-4dc1-a115-b1789d9fe399	7c7c1420-5426-4e3e-8206-a00025375295	2592000	f	900	t	f	5b4023d6-3a8f-4e3b-b9a8-14d01f939c67	0	f	0	0	4f0af65a-d506-423d-9b03-d54b7177ff31
1d7cc020-ca7c-4805-9d61-79a209cf3578	60	300	60	\N	\N	\N	t	f	0	\N	master	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	a97a30da-b5aa-4342-834a-bf05f3c14f17	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	3e26fae9-6896-4da3-b9ef-fd09c490b5cd	30067a5f-5793-4414-bbd8-22418b2f29c9	db315fe7-3796-41dc-b9ab-9eb280555a25	0c0c688f-e940-4241-b556-773e340fb8f4	ccf2aa46-cb35-4634-a57b-19468ccfb8c2	2592000	f	900	t	f	95f4b259-ee42-4579-8ff4-2ff4f179d115	0	f	0	0	105fddd2-2804-4f8b-b537-de76c1092fd3
\.


--
-- Data for Name: realm_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_attribute (name, realm_id, value) FROM stdin;
_browser_header.contentSecurityPolicyReportOnly	1d7cc020-ca7c-4805-9d61-79a209cf3578	
_browser_header.xContentTypeOptions	1d7cc020-ca7c-4805-9d61-79a209cf3578	nosniff
_browser_header.referrerPolicy	1d7cc020-ca7c-4805-9d61-79a209cf3578	no-referrer
_browser_header.xRobotsTag	1d7cc020-ca7c-4805-9d61-79a209cf3578	none
_browser_header.xFrameOptions	1d7cc020-ca7c-4805-9d61-79a209cf3578	SAMEORIGIN
_browser_header.contentSecurityPolicy	1d7cc020-ca7c-4805-9d61-79a209cf3578	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	1d7cc020-ca7c-4805-9d61-79a209cf3578	1; mode=block
_browser_header.strictTransportSecurity	1d7cc020-ca7c-4805-9d61-79a209cf3578	max-age=31536000; includeSubDomains
bruteForceProtected	1d7cc020-ca7c-4805-9d61-79a209cf3578	false
permanentLockout	1d7cc020-ca7c-4805-9d61-79a209cf3578	false
maxFailureWaitSeconds	1d7cc020-ca7c-4805-9d61-79a209cf3578	900
minimumQuickLoginWaitSeconds	1d7cc020-ca7c-4805-9d61-79a209cf3578	60
waitIncrementSeconds	1d7cc020-ca7c-4805-9d61-79a209cf3578	60
quickLoginCheckMilliSeconds	1d7cc020-ca7c-4805-9d61-79a209cf3578	1000
maxDeltaTimeSeconds	1d7cc020-ca7c-4805-9d61-79a209cf3578	43200
failureFactor	1d7cc020-ca7c-4805-9d61-79a209cf3578	30
realmReusableOtpCode	1d7cc020-ca7c-4805-9d61-79a209cf3578	false
displayName	1d7cc020-ca7c-4805-9d61-79a209cf3578	Keycloak
displayNameHtml	1d7cc020-ca7c-4805-9d61-79a209cf3578	<div class="kc-logo-text"><span>Keycloak</span></div>
defaultSignatureAlgorithm	1d7cc020-ca7c-4805-9d61-79a209cf3578	RS256
offlineSessionMaxLifespanEnabled	1d7cc020-ca7c-4805-9d61-79a209cf3578	false
offlineSessionMaxLifespan	1d7cc020-ca7c-4805-9d61-79a209cf3578	5184000
realmReusableOtpCode	f8993e77-a2d6-4198-b3cd-9ad9cde21761	false
oauth2DeviceCodeLifespan	f8993e77-a2d6-4198-b3cd-9ad9cde21761	600
oauth2DevicePollingInterval	f8993e77-a2d6-4198-b3cd-9ad9cde21761	5
cibaBackchannelTokenDeliveryMode	f8993e77-a2d6-4198-b3cd-9ad9cde21761	poll
cibaExpiresIn	f8993e77-a2d6-4198-b3cd-9ad9cde21761	120
cibaInterval	f8993e77-a2d6-4198-b3cd-9ad9cde21761	5
cibaAuthRequestedUserHint	f8993e77-a2d6-4198-b3cd-9ad9cde21761	login_hint
parRequestUriLifespan	f8993e77-a2d6-4198-b3cd-9ad9cde21761	60
clientSessionIdleTimeout	f8993e77-a2d6-4198-b3cd-9ad9cde21761	0
clientSessionMaxLifespan	f8993e77-a2d6-4198-b3cd-9ad9cde21761	0
clientOfflineSessionIdleTimeout	f8993e77-a2d6-4198-b3cd-9ad9cde21761	0
clientOfflineSessionMaxLifespan	f8993e77-a2d6-4198-b3cd-9ad9cde21761	0
shortVerificationUri	f8993e77-a2d6-4198-b3cd-9ad9cde21761	
actionTokenGeneratedByUserLifespan-verify-email	f8993e77-a2d6-4198-b3cd-9ad9cde21761	
actionTokenGeneratedByUserLifespan-idp-verify-account-via-email	f8993e77-a2d6-4198-b3cd-9ad9cde21761	
actionTokenGeneratedByUserLifespan-reset-credentials	f8993e77-a2d6-4198-b3cd-9ad9cde21761	
actionTokenGeneratedByUserLifespan-execute-actions	f8993e77-a2d6-4198-b3cd-9ad9cde21761	
bruteForceProtected	f8993e77-a2d6-4198-b3cd-9ad9cde21761	false
permanentLockout	f8993e77-a2d6-4198-b3cd-9ad9cde21761	false
maxFailureWaitSeconds	f8993e77-a2d6-4198-b3cd-9ad9cde21761	900
minimumQuickLoginWaitSeconds	f8993e77-a2d6-4198-b3cd-9ad9cde21761	60
waitIncrementSeconds	f8993e77-a2d6-4198-b3cd-9ad9cde21761	60
quickLoginCheckMilliSeconds	f8993e77-a2d6-4198-b3cd-9ad9cde21761	1000
maxDeltaTimeSeconds	f8993e77-a2d6-4198-b3cd-9ad9cde21761	43200
failureFactor	f8993e77-a2d6-4198-b3cd-9ad9cde21761	30
actionTokenGeneratedByAdminLifespan	f8993e77-a2d6-4198-b3cd-9ad9cde21761	43200
actionTokenGeneratedByUserLifespan	f8993e77-a2d6-4198-b3cd-9ad9cde21761	300
defaultSignatureAlgorithm	f8993e77-a2d6-4198-b3cd-9ad9cde21761	RS256
offlineSessionMaxLifespanEnabled	f8993e77-a2d6-4198-b3cd-9ad9cde21761	false
offlineSessionMaxLifespan	f8993e77-a2d6-4198-b3cd-9ad9cde21761	5184000
webAuthnPolicyRpEntityName	f8993e77-a2d6-4198-b3cd-9ad9cde21761	keycloak
webAuthnPolicySignatureAlgorithms	f8993e77-a2d6-4198-b3cd-9ad9cde21761	ES256
webAuthnPolicyRpId	f8993e77-a2d6-4198-b3cd-9ad9cde21761	
webAuthnPolicyAttestationConveyancePreference	f8993e77-a2d6-4198-b3cd-9ad9cde21761	not specified
webAuthnPolicyAuthenticatorAttachment	f8993e77-a2d6-4198-b3cd-9ad9cde21761	not specified
webAuthnPolicyRequireResidentKey	f8993e77-a2d6-4198-b3cd-9ad9cde21761	not specified
webAuthnPolicyUserVerificationRequirement	f8993e77-a2d6-4198-b3cd-9ad9cde21761	not specified
webAuthnPolicyCreateTimeout	f8993e77-a2d6-4198-b3cd-9ad9cde21761	0
webAuthnPolicyAvoidSameAuthenticatorRegister	f8993e77-a2d6-4198-b3cd-9ad9cde21761	false
webAuthnPolicyRpEntityNamePasswordless	f8993e77-a2d6-4198-b3cd-9ad9cde21761	keycloak
webAuthnPolicySignatureAlgorithmsPasswordless	f8993e77-a2d6-4198-b3cd-9ad9cde21761	ES256
webAuthnPolicyRpIdPasswordless	f8993e77-a2d6-4198-b3cd-9ad9cde21761	
webAuthnPolicyAttestationConveyancePreferencePasswordless	f8993e77-a2d6-4198-b3cd-9ad9cde21761	not specified
webAuthnPolicyAuthenticatorAttachmentPasswordless	f8993e77-a2d6-4198-b3cd-9ad9cde21761	not specified
webAuthnPolicyRequireResidentKeyPasswordless	f8993e77-a2d6-4198-b3cd-9ad9cde21761	not specified
webAuthnPolicyUserVerificationRequirementPasswordless	f8993e77-a2d6-4198-b3cd-9ad9cde21761	not specified
webAuthnPolicyCreateTimeoutPasswordless	f8993e77-a2d6-4198-b3cd-9ad9cde21761	0
webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless	f8993e77-a2d6-4198-b3cd-9ad9cde21761	false
client-policies.profiles	f8993e77-a2d6-4198-b3cd-9ad9cde21761	{"profiles":[]}
client-policies.policies	f8993e77-a2d6-4198-b3cd-9ad9cde21761	{"policies":[]}
_browser_header.contentSecurityPolicyReportOnly	f8993e77-a2d6-4198-b3cd-9ad9cde21761	
_browser_header.xContentTypeOptions	f8993e77-a2d6-4198-b3cd-9ad9cde21761	nosniff
_browser_header.referrerPolicy	f8993e77-a2d6-4198-b3cd-9ad9cde21761	no-referrer
_browser_header.xRobotsTag	f8993e77-a2d6-4198-b3cd-9ad9cde21761	none
_browser_header.xFrameOptions	f8993e77-a2d6-4198-b3cd-9ad9cde21761	SAMEORIGIN
_browser_header.contentSecurityPolicy	f8993e77-a2d6-4198-b3cd-9ad9cde21761	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	f8993e77-a2d6-4198-b3cd-9ad9cde21761	1; mode=block
_browser_header.strictTransportSecurity	f8993e77-a2d6-4198-b3cd-9ad9cde21761	max-age=31536000; includeSubDomains
\.


--
-- Data for Name: realm_default_groups; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_default_groups (realm_id, group_id) FROM stdin;
\.


--
-- Data for Name: realm_enabled_event_types; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_enabled_event_types (realm_id, value) FROM stdin;
\.


--
-- Data for Name: realm_events_listeners; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_events_listeners (realm_id, value) FROM stdin;
1d7cc020-ca7c-4805-9d61-79a209cf3578	jboss-logging
f8993e77-a2d6-4198-b3cd-9ad9cde21761	jboss-logging
\.


--
-- Data for Name: realm_localizations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_localizations (realm_id, locale, texts) FROM stdin;
\.


--
-- Data for Name: realm_required_credential; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_required_credential (type, form_label, input, secret, realm_id) FROM stdin;
password	password	t	t	1d7cc020-ca7c-4805-9d61-79a209cf3578
password	password	t	t	f8993e77-a2d6-4198-b3cd-9ad9cde21761
\.


--
-- Data for Name: realm_smtp_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_smtp_config (realm_id, value, name) FROM stdin;
\.


--
-- Data for Name: realm_supported_locales; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_supported_locales (realm_id, value) FROM stdin;
\.


--
-- Data for Name: redirect_uris; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.redirect_uris (client_id, value) FROM stdin;
d07b23c8-1068-4e2e-b24b-6201a6675145	/realms/master/account/*
4edd95c1-2acb-4896-92eb-697a7bb989e9	/realms/master/account/*
32903730-aa4c-4168-bfed-397484fdcb8f	/admin/master/console/*
979cf5ed-59e9-4aad-9b18-de51cab7976c	/realms/rtk_crm/account/*
62044e40-147f-440f-8b05-316c210333c0	/realms/rtk_crm/account/*
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	/admin/rtk_crm/console/*
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	/*
\.


--
-- Data for Name: required_action_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.required_action_config (required_action_id, value, name) FROM stdin;
\.


--
-- Data for Name: required_action_provider; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.required_action_provider (id, alias, name, realm_id, enabled, default_action, provider_id, priority) FROM stdin;
eb034e48-7c2d-47d7-8220-1e0d12a03002	VERIFY_EMAIL	Verify Email	1d7cc020-ca7c-4805-9d61-79a209cf3578	t	f	VERIFY_EMAIL	50
89f3e060-350c-48b3-b547-46966523e5d7	UPDATE_PROFILE	Update Profile	1d7cc020-ca7c-4805-9d61-79a209cf3578	t	f	UPDATE_PROFILE	40
1c9a960c-ad36-48d2-a187-bc3a9dd164db	CONFIGURE_TOTP	Configure OTP	1d7cc020-ca7c-4805-9d61-79a209cf3578	t	f	CONFIGURE_TOTP	10
22309a8c-e10c-41a9-9089-ca5bfadaf3c6	UPDATE_PASSWORD	Update Password	1d7cc020-ca7c-4805-9d61-79a209cf3578	t	f	UPDATE_PASSWORD	30
df93d157-295f-40ed-a682-90f4149e5e54	TERMS_AND_CONDITIONS	Terms and Conditions	1d7cc020-ca7c-4805-9d61-79a209cf3578	f	f	TERMS_AND_CONDITIONS	20
d57c7722-f629-47a6-999b-ddf6243132a8	delete_account	Delete Account	1d7cc020-ca7c-4805-9d61-79a209cf3578	f	f	delete_account	60
3fb6bcad-f469-4cb2-bc71-84cc38596f81	update_user_locale	Update User Locale	1d7cc020-ca7c-4805-9d61-79a209cf3578	t	f	update_user_locale	1000
613649ea-24b6-48f7-a271-bc2ecedbb4e0	webauthn-register	Webauthn Register	1d7cc020-ca7c-4805-9d61-79a209cf3578	t	f	webauthn-register	70
21dc7216-3059-4643-adc9-8012a720a387	webauthn-register-passwordless	Webauthn Register Passwordless	1d7cc020-ca7c-4805-9d61-79a209cf3578	t	f	webauthn-register-passwordless	80
07cfee57-b618-452d-97fb-b312cd85b2bf	VERIFY_EMAIL	Verify Email	f8993e77-a2d6-4198-b3cd-9ad9cde21761	t	f	VERIFY_EMAIL	50
e9f03519-00d9-4267-9af7-6dbf0e6c2910	UPDATE_PROFILE	Update Profile	f8993e77-a2d6-4198-b3cd-9ad9cde21761	t	f	UPDATE_PROFILE	40
bb1e6abb-5cf0-4d0c-9976-75e51d6304cf	CONFIGURE_TOTP	Configure OTP	f8993e77-a2d6-4198-b3cd-9ad9cde21761	t	f	CONFIGURE_TOTP	10
5da65773-adf0-4f6c-861d-5e43fa28708c	UPDATE_PASSWORD	Update Password	f8993e77-a2d6-4198-b3cd-9ad9cde21761	t	f	UPDATE_PASSWORD	30
e5da6638-9424-40df-b273-ca1a1b6dd80b	TERMS_AND_CONDITIONS	Terms and Conditions	f8993e77-a2d6-4198-b3cd-9ad9cde21761	f	f	TERMS_AND_CONDITIONS	20
4dff8a81-117d-48d7-aefa-d041f25d4cc0	delete_account	Delete Account	f8993e77-a2d6-4198-b3cd-9ad9cde21761	f	f	delete_account	60
608da210-8555-4e13-9989-84da298a51cc	update_user_locale	Update User Locale	f8993e77-a2d6-4198-b3cd-9ad9cde21761	t	f	update_user_locale	1000
34205358-6ace-47e1-89e3-8720a9668bac	webauthn-register	Webauthn Register	f8993e77-a2d6-4198-b3cd-9ad9cde21761	t	f	webauthn-register	70
03e44632-8199-444b-b3ad-1e4e562ca9fc	webauthn-register-passwordless	Webauthn Register Passwordless	f8993e77-a2d6-4198-b3cd-9ad9cde21761	t	f	webauthn-register-passwordless	80
\.


--
-- Data for Name: resource_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_attribute (id, name, value, resource_id) FROM stdin;
\.


--
-- Data for Name: resource_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_policy (resource_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_scope (resource_id, scope_id) FROM stdin;
\.


--
-- Data for Name: resource_server; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server (id, allow_rs_remote_mgmt, policy_enforce_mode, decision_strategy) FROM stdin;
\.


--
-- Data for Name: resource_server_perm_ticket; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_perm_ticket (id, owner, requester, created_timestamp, granted_timestamp, resource_id, scope_id, resource_server_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_server_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_policy (id, name, description, type, decision_strategy, logic, resource_server_id, owner) FROM stdin;
\.


--
-- Data for Name: resource_server_resource; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_resource (id, name, type, icon_uri, owner, resource_server_id, owner_managed_access, display_name) FROM stdin;
\.


--
-- Data for Name: resource_server_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_scope (id, name, icon_uri, resource_server_id, display_name) FROM stdin;
\.


--
-- Data for Name: resource_uris; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_uris (resource_id, value) FROM stdin;
\.


--
-- Data for Name: role_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.role_attribute (id, role_id, name, value) FROM stdin;
\.


--
-- Data for Name: scope_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.scope_mapping (client_id, role_id) FROM stdin;
4edd95c1-2acb-4896-92eb-697a7bb989e9	5501c021-14be-46dc-9b16-1ef49f7278ac
4edd95c1-2acb-4896-92eb-697a7bb989e9	4a225b99-6f15-4299-a3f5-a54298a4c238
62044e40-147f-440f-8b05-316c210333c0	b94780b6-07da-4fea-8cdc-bea8fc304de1
62044e40-147f-440f-8b05-316c210333c0	e1f74728-e8c2-4914-abaa-aa423b9cf2d7
\.


--
-- Data for Name: scope_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.scope_policy (scope_id, policy_id) FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.students (id, partnership_id, full_name, email, created_at) FROM stdin;
1	30	gAAAAABqu_T9aQwVOOJSlSewlj4I6wFjz_O89EVzpltQBj5nwSvyKReGjCTUe7iLDscbZLo6vriGPpnRJ7zhaXbEmDj0Q2rlbwq0Vd4m1IUZmmuCsBV_u5TGsV2SARzZsaQWdpnsYJamVLEt0tMRax9kdMi98yFDAA==	gAAAAABqu_T9eV_2qA_0dcArePyuDM7jwBRSmIfdDt7xNYxkZFDpN_2Djyd0i-iUmI90x9bQG9ko3J2D2QlGXfVHvSVrDw4MRm34FEs_d_rTZ-SkA5pjGpI=	2026-09-29 17:27:25.858584
2	30	gAAAAABqu_T9SpuB5oNeghcW_JPcwHzdrJWivOY4BOV1q7USJmJBTlY8vJNaw9PPjHdUhy_4tzi4TsW4rd7eN6jTF9vi4aTgVYwjVWosaqcdc0TeiirPlAkWwXKodjTefqZOsby0VLdzGlVSGykt_kq9zvnPijILSg==	gAAAAABqu_T9wnUiIZ65ecjH3NTJoHd1bo0m4QgVd--RGFw82VOQEsGNF3c2UwBqUa8sL5LMvf0vrV3shPTpsKZYfmVbBwpdDeqPfP9OePK8-xnzlcHFm40=	2026-09-29 17:27:25.863176
3	30	gAAAAABqu_T9_3bjAm2V2azPZUW8hF3l6MH3rb5Scu_Z4GwmFFAqG6p9XO6pBxMxRQsBjQaQTpi8-qQFJnW6BWlIrAFaWS8exttC8Ght2Yd_cu993wZtLJWK2TSCHw8ieZNBwxPwPQwC	gAAAAABqu_T992m9LkFdf3VKT95Tuaocau7fubNRdy2l88h8wYuIw43sc1jYCkpnmUv5BT9zyxqwcSFT7PbEMyJqfljn4pJTBgBgqXE050tXrpsAMEsNAjQ=	2026-09-29 17:27:25.864505
4	30	gAAAAABqu_T9cr7QCJjbEkyX7d_aWJntAGyR1xrqPrdTqyCNAityz8eIIxoLcsDVFHHsPQG34iUFF7Fyz05jXHLfwtK0Tkw_i7VABPZ5530_dxJtPnntDQn6A2riXpj_oYf8GBZLNZIyVsXzOd3AzEfPOOxvQDhpHg==	gAAAAABqu_T9n5gbLK2M53nAtHONPhE41ugR9yyjH-3_HOMTGi9OgmLb2CvjnVDpnbONe1h0ussC5lwpc3EIj60Sc8O7EFiqTW0bux6f3yugpjISIK8I374=	2026-09-29 17:27:25.865974
5	30	gAAAAABqu_T91SbA6AjEmAci2I8JTLg57HIzZw3tXYg5TZKL-kbLrzPsGO4ytkJOZpMNc03vwBkSI3vSbQFFe9R5pkAqdQrOdETi_mZEG8ehX7bI4TaT2xCOLJv2UJxPJCiLGEOaCADt	gAAAAABqu_T9EvQmlG4r-_XxbGSy3abm7DsLtoNticFqI2nQmjrkjt_TV9sKfO-mr5bj6x5qXxpfIYJuzLRAgc16acH8dbv_mqggznbh0HJh8sw0n4ke3rQ=	2026-09-29 17:27:25.867506
6	30	gAAAAABqu_T9YAzibUI3DI1A_borfXRi5ThsN4wrO6GP6DsNlKhc38Do1Kq8YmLnVSSGQVKMst_-Dv874ilkfhZMscQu2T1vinHrxPmCPEDS-oaMFkMAuUpQ2w6YCcazZrMhvON3VmKQsMsC1g3s_d4qxgBLmEgO5w==	gAAAAABqu_T9f53vmjVt1LfBOaEX1-bzf_MVpL-RuqpAoxzD1wrDy6PcBTaQMSeen75vt0WZpGKm6Rn0kq27w96rV-vuJpiaHo9icLRlQjbWwnAuNCz4LVw=	2026-09-29 17:27:25.869116
\.


--
-- Data for Name: universities; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.universities (id, name, region, contact_name, contact_email, contact_phone, created_at) FROM stdin;
41	МГТУ им. Н. Э. Баумана	Москва	gAAAAABqu-_7SmxR0ptM793DkPzgcZQJj0p_YazKfMQxnsCTSiaO1j2LpPWSjwPgmxFRBNqH9SLFcXvFbdthe0aOls2W7-9HF0_YpAhM_WRsdHdTlIOgYx0=	\N	\N	2026-09-29 17:06:03.713866
42	Университет ИТМО	Санкт-Петербург	gAAAAABqu-_7hsoF83TjlVdcpETLeAB0S9VRuCBmrVAouFwtmsbDzKGBnbvupe4FEpzHyWFb2XObx88g3jm9sQkZZXGwafYguXrTCe96dK0SStfvlSPgvrM=	\N	\N	2026-09-29 17:06:03.719582
43	НИЯУ МИФИ	Москва	gAAAAABqu-_7LOA3j5Qe45xrAYyjdN5ol4z8NqNPAn3MKfmB0EIpgM7pzh0C6w1YHG-uT0DSbtPVfcH3ePcsLf8d7MQS44zzSAdVS9OSYExmZm_auX9liW0=	\N	\N	2026-09-29 17:06:03.721733
44	Университет Иннополис	Татарстан	gAAAAABqu-_7ca01kaJqLw5V8wtdreHU00rGIY21X63X8mOKRZOq80EL2m7DAoAJTkdRVR2Pb5uXVBaYsttjDrFwKXKPHQrP-3wnYa1YWzAIBvkfqqebL6M=	\N	\N	2026-09-29 17:06:03.723529
45	СПбПУ Петра Великого	Санкт-Петербург	gAAAAABqu-_74VCSMX_5jFTdPXjFUxPMIbpu7qG3cFZKl4x7AaWGb_WKKjLrCSimwFbtAvBICMd-3o46Bcj8SAI8nC6dxS6cnYYcXfj2bC9sKJtFvibR06g=	\N	\N	2026-09-29 17:06:03.72862
46	НИУ ВШЭ	Москва	gAAAAABqu-_7L-tB0Ah3kdof5MSE7WClbvGJWht5fqDxPqkh3YzqFFbkGf1lgXejZmHxmKfJTz0c6cVwIWxoAxKylvPd_BEk1LFkDlPC3djdVWfxrAx5i8U=	\N	\N	2026-09-29 17:06:03.731546
47	МГТУ им. Н.Э. Баумана	Москва	gAAAAABqu_JKPyLZ9p0ygZw18j42rZiDz9004kPEJ-JEw8ONjI1vIHXOzv2f2tvI606dLEsaeAs9YmRnCKPhxRq-nqcDT0j_0Yh_azW5QPN0Fk36nhfCQl9h1WhVAXkorOnmgW5bTYZn	gAAAAABqu_JKJw7mqsIHLQ6QDV8Vq0GT5yyyUKRoHa08DqGSdlCdA4rMz6J-SC_aKH7y1IXgQgs-xIDtDibSNH5EpckuZg05oDtt7jXM1TCC2VogaS727Zw=	gAAAAABqu_JKodbFLmw5k1gccg7IvTNUhBeIIkqS4yBC3IhN9o7ZOPeZ6PtO67KAyx3uLPFskNFYGvURQkVtco8IArLlg9IwQ_-g-Gruj6TpxwlG0CBBjbU=	2026-09-29 17:15:54.593299
\.


--
-- Data for Name: user_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_attribute (name, value, user_id, id) FROM stdin;
\.


--
-- Data for Name: user_consent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_consent (id, client_id, user_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: user_consent_client_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_consent_client_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: user_entity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_entity (id, email, email_constraint, email_verified, enabled, federation_link, first_name, last_name, realm_id, username, created_timestamp, service_account_client_link, not_before) FROM stdin;
30e13ebc-661f-42bf-bfc2-5672e36acf71	\N	d4314f36-6cdc-454f-b460-882645bd3d73	f	t	\N	\N	\N	1d7cc020-ca7c-4805-9d61-79a209cf3578	admin	1790614319594	\N	0
df13a7bc-b723-41d7-9225-1e3445991a65	toptalov.maksim@mail.ru	toptalov.maksim@mail.ru	f	t	\N	Максим	Топталов	f8993e77-a2d6-4198-b3cd-9ad9cde21761	toptalov	1790617886241	\N	0
19f932a3-1a52-41f8-b8d4-534081a279f1	\N	27481ccf-4269-41b4-8dc4-8eb24573521a	f	t	\N	Иван	Иванов	f8993e77-a2d6-4198-b3cd-9ad9cde21761	ivanov	1790618094146	\N	0
bbfe6dd1-1991-46aa-be18-5340a398d431	\N	952a82ec-8280-4a5f-83c2-094ddc8faeaa	f	t	\N	Андрей	Махт	f8993e77-a2d6-4198-b3cd-9ad9cde21761	makht	1790618073354	\N	0
53558997-9585-44ba-9efb-76658cd32a18	\N	c56716f1-3d9b-4263-a3f1-82ea25a76676	f	t	\N	Павел	Милючихин	f8993e77-a2d6-4198-b3cd-9ad9cde21761	milyuchikhin	1790617978082	\N	0
012a5605-b313-49fb-b778-0d45770ffe4d	\N	cde8f2a1-8005-4a23-9840-37ed60e497e4	f	t	\N	Яхья	Амин	f8993e77-a2d6-4198-b3cd-9ad9cde21761	amin	1790617955596	\N	0
\.


--
-- Data for Name: user_federation_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_config (user_federation_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_mapper (id, name, federation_provider_id, federation_mapper_type, realm_id) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_mapper_config (user_federation_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_provider; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_provider (id, changed_sync_period, display_name, full_sync_period, last_sync, priority, provider_name, realm_id) FROM stdin;
\.


--
-- Data for Name: user_group_membership; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_group_membership (group_id, user_id) FROM stdin;
\.


--
-- Data for Name: user_required_action; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_required_action (user_id, required_action) FROM stdin;
\.


--
-- Data for Name: user_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_role_mapping (role_id, user_id) FROM stdin;
105fddd2-2804-4f8b-b537-de76c1092fd3	30e13ebc-661f-42bf-bfc2-5672e36acf71
2902cfda-09ba-4d1a-a7a9-50448f3753f4	30e13ebc-661f-42bf-bfc2-5672e36acf71
c4cae2cc-192d-479f-9a7a-1d0dff30205a	30e13ebc-661f-42bf-bfc2-5672e36acf71
4258559a-05cb-454e-951a-00adbe79cff7	30e13ebc-661f-42bf-bfc2-5672e36acf71
dcb70d01-1026-471d-83be-7bb7ea5d5d0a	30e13ebc-661f-42bf-bfc2-5672e36acf71
58c1a890-58c8-4aaf-b176-435761d0c91b	30e13ebc-661f-42bf-bfc2-5672e36acf71
97f30817-39c6-4236-bd42-4a8b4ea3b537	30e13ebc-661f-42bf-bfc2-5672e36acf71
7a2540a5-41b9-4b46-b2fe-c88656f96c6b	30e13ebc-661f-42bf-bfc2-5672e36acf71
2ee72188-980b-43b0-b9da-c048b859f13a	30e13ebc-661f-42bf-bfc2-5672e36acf71
3131e640-4171-440b-981f-ed83e91f859b	30e13ebc-661f-42bf-bfc2-5672e36acf71
ce4a9eae-bf7b-408b-9e6c-bc7b41062f7f	30e13ebc-661f-42bf-bfc2-5672e36acf71
94a87572-9d05-4a10-ae4e-f1d8726150cc	30e13ebc-661f-42bf-bfc2-5672e36acf71
7585b2d4-d2e9-4691-98c6-766bfc3c76cc	30e13ebc-661f-42bf-bfc2-5672e36acf71
8da9efba-7f7f-4311-9754-4b5dc34e5c8a	30e13ebc-661f-42bf-bfc2-5672e36acf71
921ba4ad-665c-4f17-8d64-1095ced77926	30e13ebc-661f-42bf-bfc2-5672e36acf71
64f0fddd-2bbe-45bd-8437-11cf7160c51b	30e13ebc-661f-42bf-bfc2-5672e36acf71
eb94ad25-344f-4ad9-8414-4595b7747795	30e13ebc-661f-42bf-bfc2-5672e36acf71
32069e46-e72b-4d41-891a-72f1967db1d1	30e13ebc-661f-42bf-bfc2-5672e36acf71
4cac392f-aacb-46ce-a32e-0c0b2e4452b1	30e13ebc-661f-42bf-bfc2-5672e36acf71
4f0af65a-d506-423d-9b03-d54b7177ff31	df13a7bc-b723-41d7-9225-1e3445991a65
4f0af65a-d506-423d-9b03-d54b7177ff31	012a5605-b313-49fb-b778-0d45770ffe4d
4f0af65a-d506-423d-9b03-d54b7177ff31	53558997-9585-44ba-9efb-76658cd32a18
4f0af65a-d506-423d-9b03-d54b7177ff31	bbfe6dd1-1991-46aa-be18-5340a398d431
4f0af65a-d506-423d-9b03-d54b7177ff31	19f932a3-1a52-41f8-b8d4-534081a279f1
1098a75d-ce77-4c2a-a1b4-e89069624ffa	df13a7bc-b723-41d7-9225-1e3445991a65
d00038ec-5ac1-45c8-8e2a-b70fe57c42ab	53558997-9585-44ba-9efb-76658cd32a18
d00038ec-5ac1-45c8-8e2a-b70fe57c42ab	bbfe6dd1-1991-46aa-be18-5340a398d431
d00038ec-5ac1-45c8-8e2a-b70fe57c42ab	19f932a3-1a52-41f8-b8d4-534081a279f1
73838645-7120-420a-83a7-bf34e5cc0d6b	012a5605-b313-49fb-b778-0d45770ffe4d
\.


--
-- Data for Name: user_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_session (id, auth_method, ip_address, last_session_refresh, login_username, realm_id, remember_me, started, user_id, user_session_state, broker_session_id, broker_user_id) FROM stdin;
\.


--
-- Data for Name: user_session_note; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_session_note (user_session, name, value) FROM stdin;
\.


--
-- Data for Name: username_login_failure; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.username_login_failure (realm_id, username, failed_login_not_before, last_failure, last_ip_failure, num_failures) FROM stdin;
\.


--
-- Data for Name: web_origins; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.web_origins (client_id, value) FROM stdin;
32903730-aa4c-4168-bfed-397484fdcb8f	+
ad533e32-66a1-4379-b8ff-59d4e1fbcd4a	+
e265d71a-28b0-4d1f-b067-e9c8d6c198e0	/*
\.


--
-- Data for Name: workflow_stages; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.workflow_stages (id, step_number, title, description, conditions, deadline_days) FROM stdin;
2	2	Коммуникация и уточнение программ	\N	\N	\N
3	9	efefefefefeОрганизация встречи	\N	[true, true, true]	\N
4	3	Обмен документами для подписания	\N	\N	\N
5	4	Корректировка документов	\N	\N	\N
6	5	Подписание документов	\N	\N	\N
7	6	Передача материалов и лицензий ПО	\N	\N	\N
8	7	Сопровождение внедрения	\N	\N	\N
9	8	Обучение преподавателей	\N	\N	\N
10	10	Актуализация учебной программы	\N	\N	\N
11	11	Ведение занятий	\N	\N	\N
12	12	Актуализация документации	\N	\N	\N
13	13	Повышение квалификации преподавателей	\N	\N	\N
14	14	Контроль за исполнением этапов	\N	\N	\N
15	1	erererrer	\N	[true, true, true]	\N
\.


--
-- Data for Name: workflow_state; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.workflow_state (id, version) FROM stdin;
1	5
\.


--
-- Name: attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.attachments_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 97, true);


--
-- Name: catalog_managers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.catalog_managers_id_seq', 3, true);


--
-- Name: partnership_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.partnership_comments_id_seq', 6, true);


--
-- Name: partnership_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.partnership_requests_id_seq', 1, false);


--
-- Name: partnerships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.partnerships_id_seq', 33, true);


--
-- Name: programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.programs_id_seq', 54, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.students_id_seq', 6, true);


--
-- Name: universities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.universities_id_seq', 47, true);


--
-- Name: workflow_stages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.workflow_stages_id_seq', 15, true);


--
-- Name: workflow_state_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.workflow_state_id_seq', 1, false);


--
-- Name: username_login_failure CONSTRAINT_17-2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.username_login_failure
    ADD CONSTRAINT "CONSTRAINT_17-2" PRIMARY KEY (realm_id, username);


--
-- Name: keycloak_role UK_J3RWUVD56ONTGSUHOGM184WW2-2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT "UK_J3RWUVD56ONTGSUHOGM184WW2-2" UNIQUE (name, client_realm_constraint);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: client_auth_flow_bindings c_cli_flow_bind; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_auth_flow_bindings
    ADD CONSTRAINT c_cli_flow_bind PRIMARY KEY (client_id, binding_name);


--
-- Name: client_scope_client c_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_client
    ADD CONSTRAINT c_cli_scope_bind PRIMARY KEY (client_id, scope_id);


--
-- Name: catalog_import_jobs catalog_import_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.catalog_import_jobs
    ADD CONSTRAINT catalog_import_jobs_pkey PRIMARY KEY (id);


--
-- Name: catalog_managers catalog_managers_name_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.catalog_managers
    ADD CONSTRAINT catalog_managers_name_key UNIQUE (name);


--
-- Name: catalog_managers catalog_managers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.catalog_managers
    ADD CONSTRAINT catalog_managers_pkey PRIMARY KEY (id);


--
-- Name: client_initial_access cnstr_client_init_acc_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT cnstr_client_init_acc_pk PRIMARY KEY (id);


--
-- Name: realm_default_groups con_group_id_def_groups; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT con_group_id_def_groups UNIQUE (group_id);


--
-- Name: broker_link constr_broker_link_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.broker_link
    ADD CONSTRAINT constr_broker_link_pk PRIMARY KEY (identity_provider, user_id);


--
-- Name: client_user_session_note constr_cl_usr_ses_note; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_user_session_note
    ADD CONSTRAINT constr_cl_usr_ses_note PRIMARY KEY (client_session, name);


--
-- Name: component_config constr_component_config_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT constr_component_config_pk PRIMARY KEY (id);


--
-- Name: component constr_component_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT constr_component_pk PRIMARY KEY (id);


--
-- Name: fed_user_required_action constr_fed_required_action; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_required_action
    ADD CONSTRAINT constr_fed_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: fed_user_attribute constr_fed_user_attr_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_attribute
    ADD CONSTRAINT constr_fed_user_attr_pk PRIMARY KEY (id);


--
-- Name: fed_user_consent constr_fed_user_consent_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_consent
    ADD CONSTRAINT constr_fed_user_consent_pk PRIMARY KEY (id);


--
-- Name: fed_user_credential constr_fed_user_cred_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_credential
    ADD CONSTRAINT constr_fed_user_cred_pk PRIMARY KEY (id);


--
-- Name: fed_user_group_membership constr_fed_user_group; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_group_membership
    ADD CONSTRAINT constr_fed_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: fed_user_role_mapping constr_fed_user_role; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_role_mapping
    ADD CONSTRAINT constr_fed_user_role PRIMARY KEY (role_id, user_id);


--
-- Name: federated_user constr_federated_user; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.federated_user
    ADD CONSTRAINT constr_federated_user PRIMARY KEY (id);


--
-- Name: realm_default_groups constr_realm_default_groups; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT constr_realm_default_groups PRIMARY KEY (realm_id, group_id);


--
-- Name: realm_enabled_event_types constr_realm_enabl_event_types; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT constr_realm_enabl_event_types PRIMARY KEY (realm_id, value);


--
-- Name: realm_events_listeners constr_realm_events_listeners; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT constr_realm_events_listeners PRIMARY KEY (realm_id, value);


--
-- Name: realm_supported_locales constr_realm_supported_locales; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT constr_realm_supported_locales PRIMARY KEY (realm_id, value);


--
-- Name: identity_provider constraint_2b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT constraint_2b PRIMARY KEY (internal_id);


--
-- Name: client_attributes constraint_3c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT constraint_3c PRIMARY KEY (client_id, name);


--
-- Name: event_entity constraint_4; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.event_entity
    ADD CONSTRAINT constraint_4 PRIMARY KEY (id);


--
-- Name: federated_identity constraint_40; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT constraint_40 PRIMARY KEY (identity_provider, user_id);


--
-- Name: realm constraint_4a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT constraint_4a PRIMARY KEY (id);


--
-- Name: client_session_role constraint_5; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_role
    ADD CONSTRAINT constraint_5 PRIMARY KEY (client_session, role_id);


--
-- Name: user_session constraint_57; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT constraint_57 PRIMARY KEY (id);


--
-- Name: user_federation_provider constraint_5c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT constraint_5c PRIMARY KEY (id);


--
-- Name: client_session_note constraint_5e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_note
    ADD CONSTRAINT constraint_5e PRIMARY KEY (client_session, name);


--
-- Name: client constraint_7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT constraint_7 PRIMARY KEY (id);


--
-- Name: client_session constraint_8; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session
    ADD CONSTRAINT constraint_8 PRIMARY KEY (id);


--
-- Name: scope_mapping constraint_81; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT constraint_81 PRIMARY KEY (client_id, role_id);


--
-- Name: client_node_registrations constraint_84; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT constraint_84 PRIMARY KEY (client_id, name);


--
-- Name: realm_attribute constraint_9; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT constraint_9 PRIMARY KEY (name, realm_id);


--
-- Name: realm_required_credential constraint_92; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT constraint_92 PRIMARY KEY (realm_id, type);


--
-- Name: keycloak_role constraint_a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT constraint_a PRIMARY KEY (id);


--
-- Name: admin_event_entity constraint_admin_event_entity; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.admin_event_entity
    ADD CONSTRAINT constraint_admin_event_entity PRIMARY KEY (id);


--
-- Name: authenticator_config_entry constraint_auth_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authenticator_config_entry
    ADD CONSTRAINT constraint_auth_cfg_pk PRIMARY KEY (authenticator_id, name);


--
-- Name: authentication_execution constraint_auth_exec_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT constraint_auth_exec_pk PRIMARY KEY (id);


--
-- Name: authentication_flow constraint_auth_flow_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT constraint_auth_flow_pk PRIMARY KEY (id);


--
-- Name: authenticator_config constraint_auth_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT constraint_auth_pk PRIMARY KEY (id);


--
-- Name: client_session_auth_status constraint_auth_status_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_auth_status
    ADD CONSTRAINT constraint_auth_status_pk PRIMARY KEY (client_session, authenticator);


--
-- Name: user_role_mapping constraint_c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT constraint_c PRIMARY KEY (role_id, user_id);


--
-- Name: composite_role constraint_composite_role; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT constraint_composite_role PRIMARY KEY (composite, child_role);


--
-- Name: client_session_prot_mapper constraint_cs_pmp_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_prot_mapper
    ADD CONSTRAINT constraint_cs_pmp_pk PRIMARY KEY (client_session, protocol_mapper_id);


--
-- Name: identity_provider_config constraint_d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT constraint_d PRIMARY KEY (identity_provider_id, name);


--
-- Name: policy_config constraint_dpc; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT constraint_dpc PRIMARY KEY (policy_id, name);


--
-- Name: realm_smtp_config constraint_e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT constraint_e PRIMARY KEY (realm_id, name);


--
-- Name: credential constraint_f; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT constraint_f PRIMARY KEY (id);


--
-- Name: user_federation_config constraint_f9; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT constraint_f9 PRIMARY KEY (user_federation_provider_id, name);


--
-- Name: resource_server_perm_ticket constraint_fapmt; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT constraint_fapmt PRIMARY KEY (id);


--
-- Name: resource_server_resource constraint_farsr; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT constraint_farsr PRIMARY KEY (id);


--
-- Name: resource_server_policy constraint_farsrp; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT constraint_farsrp PRIMARY KEY (id);


--
-- Name: associated_policy constraint_farsrpap; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT constraint_farsrpap PRIMARY KEY (policy_id, associated_policy_id);


--
-- Name: resource_policy constraint_farsrpp; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT constraint_farsrpp PRIMARY KEY (resource_id, policy_id);


--
-- Name: resource_server_scope constraint_farsrs; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT constraint_farsrs PRIMARY KEY (id);


--
-- Name: resource_scope constraint_farsrsp; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT constraint_farsrsp PRIMARY KEY (resource_id, scope_id);


--
-- Name: scope_policy constraint_farsrsps; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT constraint_farsrsps PRIMARY KEY (scope_id, policy_id);


--
-- Name: user_entity constraint_fb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT constraint_fb PRIMARY KEY (id);


--
-- Name: user_federation_mapper_config constraint_fedmapper_cfg_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT constraint_fedmapper_cfg_pm PRIMARY KEY (user_federation_mapper_id, name);


--
-- Name: user_federation_mapper constraint_fedmapperpm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT constraint_fedmapperpm PRIMARY KEY (id);


--
-- Name: fed_user_consent_cl_scope constraint_fgrntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_consent_cl_scope
    ADD CONSTRAINT constraint_fgrntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent_client_scope constraint_grntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT constraint_grntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent constraint_grntcsnt_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT constraint_grntcsnt_pm PRIMARY KEY (id);


--
-- Name: keycloak_group constraint_group; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT constraint_group PRIMARY KEY (id);


--
-- Name: group_attribute constraint_group_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT constraint_group_attribute_pk PRIMARY KEY (id);


--
-- Name: group_role_mapping constraint_group_role; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT constraint_group_role PRIMARY KEY (role_id, group_id);


--
-- Name: identity_provider_mapper constraint_idpm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT constraint_idpm PRIMARY KEY (id);


--
-- Name: idp_mapper_config constraint_idpmconfig; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT constraint_idpmconfig PRIMARY KEY (idp_mapper_id, name);


--
-- Name: migration_model constraint_migmod; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT constraint_migmod PRIMARY KEY (id);


--
-- Name: offline_client_session constraint_offl_cl_ses_pk3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.offline_client_session
    ADD CONSTRAINT constraint_offl_cl_ses_pk3 PRIMARY KEY (user_session_id, client_id, client_storage_provider, external_client_id, offline_flag);


--
-- Name: offline_user_session constraint_offl_us_ses_pk2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.offline_user_session
    ADD CONSTRAINT constraint_offl_us_ses_pk2 PRIMARY KEY (user_session_id, offline_flag);


--
-- Name: protocol_mapper constraint_pcm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT constraint_pcm PRIMARY KEY (id);


--
-- Name: protocol_mapper_config constraint_pmconfig; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT constraint_pmconfig PRIMARY KEY (protocol_mapper_id, name);


--
-- Name: redirect_uris constraint_redirect_uris; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT constraint_redirect_uris PRIMARY KEY (client_id, value);


--
-- Name: required_action_config constraint_req_act_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.required_action_config
    ADD CONSTRAINT constraint_req_act_cfg_pk PRIMARY KEY (required_action_id, name);


--
-- Name: required_action_provider constraint_req_act_prv_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT constraint_req_act_prv_pk PRIMARY KEY (id);


--
-- Name: user_required_action constraint_required_action; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT constraint_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: resource_uris constraint_resour_uris_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT constraint_resour_uris_pk PRIMARY KEY (resource_id, value);


--
-- Name: role_attribute constraint_role_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT constraint_role_attribute_pk PRIMARY KEY (id);


--
-- Name: user_attribute constraint_user_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT constraint_user_attribute_pk PRIMARY KEY (id);


--
-- Name: user_group_membership constraint_user_group; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT constraint_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: user_session_note constraint_usn_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_session_note
    ADD CONSTRAINT constraint_usn_pk PRIMARY KEY (user_session, name);


--
-- Name: web_origins constraint_web_origins; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT constraint_web_origins PRIMARY KEY (client_id, value);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: partnership_comments partnership_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnership_comments
    ADD CONSTRAINT partnership_comments_pkey PRIMARY KEY (id);


--
-- Name: partnership_requests partnership_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnership_requests
    ADD CONSTRAINT partnership_requests_pkey PRIMARY KEY (id);


--
-- Name: partnership_state partnership_state_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnership_state
    ADD CONSTRAINT partnership_state_pkey PRIMARY KEY (partnership_id);


--
-- Name: partnerships partnerships_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnerships
    ADD CONSTRAINT partnerships_pkey PRIMARY KEY (id);


--
-- Name: client_scope_attributes pk_cl_tmpl_attr; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT pk_cl_tmpl_attr PRIMARY KEY (scope_id, name);


--
-- Name: client_scope pk_cli_template; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT pk_cli_template PRIMARY KEY (id);


--
-- Name: resource_server pk_resource_server; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server
    ADD CONSTRAINT pk_resource_server PRIMARY KEY (id);


--
-- Name: client_scope_role_mapping pk_template_scope; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT pk_template_scope PRIMARY KEY (scope_id, role_id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: default_client_scope r_def_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT r_def_cli_scope_bind PRIMARY KEY (realm_id, scope_id);


--
-- Name: realm_localizations realm_localizations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_localizations
    ADD CONSTRAINT realm_localizations_pkey PRIMARY KEY (realm_id, locale);


--
-- Name: resource_attribute res_attr_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT res_attr_pk PRIMARY KEY (id);


--
-- Name: keycloak_group sibling_names; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT sibling_names UNIQUE (realm_id, parent_group, name);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: identity_provider uk_2daelwnibji49avxsrtuf6xj33; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT uk_2daelwnibji49avxsrtuf6xj33 UNIQUE (provider_alias, realm_id);


--
-- Name: client uk_b71cjlbenv945rb6gcon438at; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT uk_b71cjlbenv945rb6gcon438at UNIQUE (realm_id, client_id);


--
-- Name: client_scope uk_cli_scope; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT uk_cli_scope UNIQUE (realm_id, name);


--
-- Name: user_entity uk_dykn684sl8up1crfei6eckhd7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_dykn684sl8up1crfei6eckhd7 UNIQUE (realm_id, email_constraint);


--
-- Name: resource_server_resource uk_frsr6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5ha6 UNIQUE (name, owner, resource_server_id);


--
-- Name: resource_server_perm_ticket uk_frsr6t700s9v50bu18ws5pmt; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5pmt UNIQUE (owner, requester, resource_server_id, resource_id, scope_id);


--
-- Name: resource_server_policy uk_frsrpt700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT uk_frsrpt700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: resource_server_scope uk_frsrst700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT uk_frsrst700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: user_consent uk_jkuwuvd56ontgsuhogm8uewrt; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_jkuwuvd56ontgsuhogm8uewrt UNIQUE (client_id, client_storage_provider, external_client_id, user_id);


--
-- Name: realm uk_orvsdmla56612eaefiq6wl5oi; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT uk_orvsdmla56612eaefiq6wl5oi UNIQUE (name);


--
-- Name: user_entity uk_ru8tt6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_ru8tt6t700s9v50bu18ws5ha6 UNIQUE (realm_id, username);


--
-- Name: universities universities_name_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_name_key UNIQUE (name);


--
-- Name: universities universities_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_pkey PRIMARY KEY (id);


--
-- Name: workflow_stages workflow_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.workflow_stages
    ADD CONSTRAINT workflow_stages_pkey PRIMARY KEY (id);


--
-- Name: workflow_stages workflow_stages_step_number_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.workflow_stages
    ADD CONSTRAINT workflow_stages_step_number_key UNIQUE (step_number);


--
-- Name: workflow_state workflow_state_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.workflow_state
    ADD CONSTRAINT workflow_state_pkey PRIMARY KEY (id);


--
-- Name: idx_admin_event_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_admin_event_time ON public.admin_event_entity USING btree (realm_id, admin_event_time);


--
-- Name: idx_assoc_pol_assoc_pol_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_assoc_pol_assoc_pol_id ON public.associated_policy USING btree (associated_policy_id);


--
-- Name: idx_auth_config_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_config_realm ON public.authenticator_config USING btree (realm_id);


--
-- Name: idx_auth_exec_flow; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_exec_flow ON public.authentication_execution USING btree (flow_id);


--
-- Name: idx_auth_exec_realm_flow; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_exec_realm_flow ON public.authentication_execution USING btree (realm_id, flow_id);


--
-- Name: idx_auth_flow_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_flow_realm ON public.authentication_flow USING btree (realm_id);


--
-- Name: idx_cl_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_cl_clscope ON public.client_scope_client USING btree (scope_id);


--
-- Name: idx_client_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_client_id ON public.client USING btree (client_id);


--
-- Name: idx_client_init_acc_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_client_init_acc_realm ON public.client_initial_access USING btree (realm_id);


--
-- Name: idx_client_session_session; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_client_session_session ON public.client_session USING btree (session_id);


--
-- Name: idx_clscope_attrs; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_attrs ON public.client_scope_attributes USING btree (scope_id);


--
-- Name: idx_clscope_cl; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_cl ON public.client_scope_client USING btree (client_id);


--
-- Name: idx_clscope_protmap; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_protmap ON public.protocol_mapper USING btree (client_scope_id);


--
-- Name: idx_clscope_role; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_role ON public.client_scope_role_mapping USING btree (scope_id);


--
-- Name: idx_compo_config_compo; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_compo_config_compo ON public.component_config USING btree (component_id);


--
-- Name: idx_component_provider_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_component_provider_type ON public.component USING btree (provider_type);


--
-- Name: idx_component_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_component_realm ON public.component USING btree (realm_id);


--
-- Name: idx_composite; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_composite ON public.composite_role USING btree (composite);


--
-- Name: idx_composite_child; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_composite_child ON public.composite_role USING btree (child_role);


--
-- Name: idx_defcls_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_defcls_realm ON public.default_client_scope USING btree (realm_id);


--
-- Name: idx_defcls_scope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_defcls_scope ON public.default_client_scope USING btree (scope_id);


--
-- Name: idx_event_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_event_time ON public.event_entity USING btree (realm_id, event_time);


--
-- Name: idx_fedidentity_feduser; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fedidentity_feduser ON public.federated_identity USING btree (federated_user_id);


--
-- Name: idx_fedidentity_user; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fedidentity_user ON public.federated_identity USING btree (user_id);


--
-- Name: idx_fu_attribute; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_attribute ON public.fed_user_attribute USING btree (user_id, realm_id, name);


--
-- Name: idx_fu_cnsnt_ext; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_cnsnt_ext ON public.fed_user_consent USING btree (user_id, client_storage_provider, external_client_id);


--
-- Name: idx_fu_consent; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_consent ON public.fed_user_consent USING btree (user_id, client_id);


--
-- Name: idx_fu_consent_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_consent_ru ON public.fed_user_consent USING btree (realm_id, user_id);


--
-- Name: idx_fu_credential; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_credential ON public.fed_user_credential USING btree (user_id, type);


--
-- Name: idx_fu_credential_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_credential_ru ON public.fed_user_credential USING btree (realm_id, user_id);


--
-- Name: idx_fu_group_membership; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_group_membership ON public.fed_user_group_membership USING btree (user_id, group_id);


--
-- Name: idx_fu_group_membership_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_group_membership_ru ON public.fed_user_group_membership USING btree (realm_id, user_id);


--
-- Name: idx_fu_required_action; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_required_action ON public.fed_user_required_action USING btree (user_id, required_action);


--
-- Name: idx_fu_required_action_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_required_action_ru ON public.fed_user_required_action USING btree (realm_id, user_id);


--
-- Name: idx_fu_role_mapping; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_role_mapping ON public.fed_user_role_mapping USING btree (user_id, role_id);


--
-- Name: idx_fu_role_mapping_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_role_mapping_ru ON public.fed_user_role_mapping USING btree (realm_id, user_id);


--
-- Name: idx_group_att_by_name_value; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_group_att_by_name_value ON public.group_attribute USING btree (name, ((value)::character varying(250)));


--
-- Name: idx_group_attr_group; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_group_attr_group ON public.group_attribute USING btree (group_id);


--
-- Name: idx_group_role_mapp_group; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_group_role_mapp_group ON public.group_role_mapping USING btree (group_id);


--
-- Name: idx_id_prov_mapp_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_id_prov_mapp_realm ON public.identity_provider_mapper USING btree (realm_id);


--
-- Name: idx_ident_prov_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_ident_prov_realm ON public.identity_provider USING btree (realm_id);


--
-- Name: idx_keycloak_role_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_keycloak_role_client ON public.keycloak_role USING btree (client);


--
-- Name: idx_keycloak_role_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_keycloak_role_realm ON public.keycloak_role USING btree (realm);


--
-- Name: idx_offline_css_preload; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_css_preload ON public.offline_client_session USING btree (client_id, offline_flag);


--
-- Name: idx_offline_uss_by_user; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_by_user ON public.offline_user_session USING btree (user_id, realm_id, offline_flag);


--
-- Name: idx_offline_uss_by_usersess; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_by_usersess ON public.offline_user_session USING btree (realm_id, offline_flag, user_session_id);


--
-- Name: idx_offline_uss_createdon; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_createdon ON public.offline_user_session USING btree (created_on);


--
-- Name: idx_offline_uss_preload; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_preload ON public.offline_user_session USING btree (offline_flag, created_on, user_session_id);


--
-- Name: idx_protocol_mapper_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_protocol_mapper_client ON public.protocol_mapper USING btree (client_id);


--
-- Name: idx_realm_attr_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_attr_realm ON public.realm_attribute USING btree (realm_id);


--
-- Name: idx_realm_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_clscope ON public.client_scope USING btree (realm_id);


--
-- Name: idx_realm_def_grp_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_def_grp_realm ON public.realm_default_groups USING btree (realm_id);


--
-- Name: idx_realm_evt_list_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_evt_list_realm ON public.realm_events_listeners USING btree (realm_id);


--
-- Name: idx_realm_evt_types_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_evt_types_realm ON public.realm_enabled_event_types USING btree (realm_id);


--
-- Name: idx_realm_master_adm_cli; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_master_adm_cli ON public.realm USING btree (master_admin_client);


--
-- Name: idx_realm_supp_local_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_supp_local_realm ON public.realm_supported_locales USING btree (realm_id);


--
-- Name: idx_redir_uri_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_redir_uri_client ON public.redirect_uris USING btree (client_id);


--
-- Name: idx_req_act_prov_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_req_act_prov_realm ON public.required_action_provider USING btree (realm_id);


--
-- Name: idx_res_policy_policy; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_policy_policy ON public.resource_policy USING btree (policy_id);


--
-- Name: idx_res_scope_scope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_scope_scope ON public.resource_scope USING btree (scope_id);


--
-- Name: idx_res_serv_pol_res_serv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_serv_pol_res_serv ON public.resource_server_policy USING btree (resource_server_id);


--
-- Name: idx_res_srv_res_res_srv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_srv_res_res_srv ON public.resource_server_resource USING btree (resource_server_id);


--
-- Name: idx_res_srv_scope_res_srv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_srv_scope_res_srv ON public.resource_server_scope USING btree (resource_server_id);


--
-- Name: idx_role_attribute; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_role_attribute ON public.role_attribute USING btree (role_id);


--
-- Name: idx_role_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_role_clscope ON public.client_scope_role_mapping USING btree (role_id);


--
-- Name: idx_scope_mapping_role; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_scope_mapping_role ON public.scope_mapping USING btree (role_id);


--
-- Name: idx_scope_policy_policy; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_scope_policy_policy ON public.scope_policy USING btree (policy_id);


--
-- Name: idx_update_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_update_time ON public.migration_model USING btree (update_time);


--
-- Name: idx_us_sess_id_on_cl_sess; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_us_sess_id_on_cl_sess ON public.offline_client_session USING btree (user_session_id);


--
-- Name: idx_usconsent_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usconsent_clscope ON public.user_consent_client_scope USING btree (user_consent_id);


--
-- Name: idx_user_attribute; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_attribute ON public.user_attribute USING btree (user_id);


--
-- Name: idx_user_attribute_name; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_attribute_name ON public.user_attribute USING btree (name, value);


--
-- Name: idx_user_consent; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_consent ON public.user_consent USING btree (user_id);


--
-- Name: idx_user_credential; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_credential ON public.credential USING btree (user_id);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_email ON public.user_entity USING btree (email);


--
-- Name: idx_user_group_mapping; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_group_mapping ON public.user_group_membership USING btree (user_id);


--
-- Name: idx_user_reqactions; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_reqactions ON public.user_required_action USING btree (user_id);


--
-- Name: idx_user_role_mapping; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_role_mapping ON public.user_role_mapping USING btree (user_id);


--
-- Name: idx_user_service_account; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_service_account ON public.user_entity USING btree (realm_id, service_account_client_link);


--
-- Name: idx_usr_fed_map_fed_prv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usr_fed_map_fed_prv ON public.user_federation_mapper USING btree (federation_provider_id);


--
-- Name: idx_usr_fed_map_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usr_fed_map_realm ON public.user_federation_mapper USING btree (realm_id);


--
-- Name: idx_usr_fed_prv_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usr_fed_prv_realm ON public.user_federation_provider USING btree (realm_id);


--
-- Name: idx_web_orig_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_web_orig_client ON public.web_origins USING btree (client_id);


--
-- Name: ix_attachments_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_attachments_id ON public.attachments USING btree (id);


--
-- Name: ix_audit_logs_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_audit_logs_id ON public.audit_logs USING btree (id);


--
-- Name: ix_partnership_comments_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_partnership_comments_id ON public.partnership_comments USING btree (id);


--
-- Name: ix_partnership_requests_requester; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_partnership_requests_requester ON public.partnership_requests USING btree (requester);


--
-- Name: ix_partnerships_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_partnerships_id ON public.partnerships USING btree (id);


--
-- Name: ix_programs_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_programs_id ON public.programs USING btree (id);


--
-- Name: ix_programs_priority; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_programs_priority ON public.programs USING btree (priority);


--
-- Name: ix_students_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_students_id ON public.students USING btree (id);


--
-- Name: ix_universities_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_universities_id ON public.universities USING btree (id);


--
-- Name: ix_workflow_stages_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ix_workflow_stages_id ON public.workflow_stages USING btree (id);


--
-- Name: attachments attachments_partnership_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_partnership_id_fkey FOREIGN KEY (partnership_id) REFERENCES public.partnerships(id);


--
-- Name: client_session_auth_status auth_status_constraint; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_auth_status
    ADD CONSTRAINT auth_status_constraint FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: identity_provider fk2b4ebc52ae5c3b34; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT fk2b4ebc52ae5c3b34 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_attributes fk3c47c64beacca966; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT fk3c47c64beacca966 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: federated_identity fk404288b92ef007a6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT fk404288b92ef007a6 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_node_registrations fk4129723ba992f594; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT fk4129723ba992f594 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: client_session_note fk5edfb00ff51c2736; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_note
    ADD CONSTRAINT fk5edfb00ff51c2736 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: user_session_note fk5edfb00ff51d3472; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_session_note
    ADD CONSTRAINT fk5edfb00ff51d3472 FOREIGN KEY (user_session) REFERENCES public.user_session(id);


--
-- Name: client_session_role fk_11b7sgqw18i532811v7o2dv76; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_role
    ADD CONSTRAINT fk_11b7sgqw18i532811v7o2dv76 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: redirect_uris fk_1burs8pb4ouj97h5wuppahv9f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT fk_1burs8pb4ouj97h5wuppahv9f FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: user_federation_provider fk_1fj32f6ptolw2qy60cd8n01e8; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT fk_1fj32f6ptolw2qy60cd8n01e8 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_session_prot_mapper fk_33a8sgqw18i532811v7o2dk89; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_prot_mapper
    ADD CONSTRAINT fk_33a8sgqw18i532811v7o2dk89 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: realm_required_credential fk_5hg65lybevavkqfki3kponh9v; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT fk_5hg65lybevavkqfki3kponh9v FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_attribute fk_5hrm2vlf9ql5fu022kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu022kqepovbr FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: user_attribute fk_5hrm2vlf9ql5fu043kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu043kqepovbr FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: user_required_action fk_6qj3w1jw9cvafhe19bwsiuvmd; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT fk_6qj3w1jw9cvafhe19bwsiuvmd FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: keycloak_role fk_6vyqfe4cn4wlq8r6kt5vdsj5c; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT fk_6vyqfe4cn4wlq8r6kt5vdsj5c FOREIGN KEY (realm) REFERENCES public.realm(id);


--
-- Name: realm_smtp_config fk_70ej8xdxgxd0b9hh6180irr0o; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT fk_70ej8xdxgxd0b9hh6180irr0o FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_attribute fk_8shxd6l3e9atqukacxgpffptw; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT fk_8shxd6l3e9atqukacxgpffptw FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: composite_role fk_a63wvekftu8jo1pnj81e7mce2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_a63wvekftu8jo1pnj81e7mce2 FOREIGN KEY (composite) REFERENCES public.keycloak_role(id);


--
-- Name: authentication_execution fk_auth_exec_flow; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_flow FOREIGN KEY (flow_id) REFERENCES public.authentication_flow(id);


--
-- Name: authentication_execution fk_auth_exec_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authentication_flow fk_auth_flow_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT fk_auth_flow_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authenticator_config fk_auth_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT fk_auth_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_session fk_b4ao2vcvat6ukau74wbwtfqo1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session
    ADD CONSTRAINT fk_b4ao2vcvat6ukau74wbwtfqo1 FOREIGN KEY (session_id) REFERENCES public.user_session(id);


--
-- Name: user_role_mapping fk_c4fqv34p1mbylloxang7b1q3l; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT fk_c4fqv34p1mbylloxang7b1q3l FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_scope_attributes fk_cl_scope_attr_scope; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT fk_cl_scope_attr_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_scope_role_mapping fk_cl_scope_rm_scope; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT fk_cl_scope_rm_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_user_session_note fk_cl_usr_ses_note; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_user_session_note
    ADD CONSTRAINT fk_cl_usr_ses_note FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: protocol_mapper fk_cli_scope_mapper; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_cli_scope_mapper FOREIGN KEY (client_scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_initial_access fk_client_init_acc_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT fk_client_init_acc_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: component_config fk_component_config; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT fk_component_config FOREIGN KEY (component_id) REFERENCES public.component(id);


--
-- Name: component fk_component_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT fk_component_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_default_groups fk_def_groups_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT fk_def_groups_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_mapper_config fk_fedmapper_cfg; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT fk_fedmapper_cfg FOREIGN KEY (user_federation_mapper_id) REFERENCES public.user_federation_mapper(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_fedprv; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_fedprv FOREIGN KEY (federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: associated_policy fk_frsr5s213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsr5s213xcx4wnkog82ssrfy FOREIGN KEY (associated_policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrasp13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrasp13xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog82sspmt; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82sspmt FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_resource fk_frsrho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog83sspmt; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog83sspmt FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog84sspmt; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog84sspmt FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: associated_policy fk_frsrpas14xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsrpas14xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrpass3xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrpass3xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_perm_ticket fk_frsrpo2128cx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrpo2128cx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_policy fk_frsrpo213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT fk_frsrpo213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_scope fk_frsrpos13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrpos13xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpos53xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpos53xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpp213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpp213xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_scope fk_frsrps213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrps213xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_scope fk_frsrso213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT fk_frsrso213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: composite_role fk_gr7thllb9lu8q4vqa4524jjy8; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_gr7thllb9lu8q4vqa4524jjy8 FOREIGN KEY (child_role) REFERENCES public.keycloak_role(id);


--
-- Name: user_consent_client_scope fk_grntcsnt_clsc_usc; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT fk_grntcsnt_clsc_usc FOREIGN KEY (user_consent_id) REFERENCES public.user_consent(id);


--
-- Name: user_consent fk_grntcsnt_user; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT fk_grntcsnt_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: group_attribute fk_group_attribute_group; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT fk_group_attribute_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: group_role_mapping fk_group_role_group; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT fk_group_role_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: realm_enabled_event_types fk_h846o4h0w8epx5nwedrf5y69j; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT fk_h846o4h0w8epx5nwedrf5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_events_listeners fk_h846o4h0w8epx5nxev9f5y69j; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT fk_h846o4h0w8epx5nxev9f5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: identity_provider_mapper fk_idpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT fk_idpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: idp_mapper_config fk_idpmconfig; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT fk_idpmconfig FOREIGN KEY (idp_mapper_id) REFERENCES public.identity_provider_mapper(id);


--
-- Name: web_origins fk_lojpho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT fk_lojpho213xcx4wnkog82ssrfy FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: scope_mapping fk_ouse064plmlr732lxjcn1q5f1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT fk_ouse064plmlr732lxjcn1q5f1 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: protocol_mapper fk_pcm_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_pcm_realm FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: credential fk_pfyr0glasqyl0dei3kl69r6v0; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT fk_pfyr0glasqyl0dei3kl69r6v0 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: protocol_mapper_config fk_pmconfig; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT fk_pmconfig FOREIGN KEY (protocol_mapper_id) REFERENCES public.protocol_mapper(id);


--
-- Name: default_client_scope fk_r_def_cli_scope_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT fk_r_def_cli_scope_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: required_action_provider fk_req_act_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT fk_req_act_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_uris fk_resource_server_uris; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT fk_resource_server_uris FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: role_attribute fk_role_attribute_id; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT fk_role_attribute_id FOREIGN KEY (role_id) REFERENCES public.keycloak_role(id);


--
-- Name: realm_supported_locales fk_supported_locales_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT fk_supported_locales_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_config fk_t13hpu1j94r2ebpekr39x5eu5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT fk_t13hpu1j94r2ebpekr39x5eu5 FOREIGN KEY (user_federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_group_membership fk_user_group_user; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT fk_user_group_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: policy_config fkdc34197cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT fkdc34197cf864c4e43 FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: identity_provider_config fkdc4897cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT fkdc4897cf864c4e43 FOREIGN KEY (identity_provider_id) REFERENCES public.identity_provider(internal_id);


--
-- Name: partnership_comments partnership_comments_partnership_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnership_comments
    ADD CONSTRAINT partnership_comments_partnership_id_fkey FOREIGN KEY (partnership_id) REFERENCES public.partnerships(id);


--
-- Name: partnership_requests partnership_requests_partnership_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnership_requests
    ADD CONSTRAINT partnership_requests_partnership_id_fkey FOREIGN KEY (partnership_id) REFERENCES public.partnerships(id);


--
-- Name: partnership_requests partnership_requests_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnership_requests
    ADD CONSTRAINT partnership_requests_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: partnership_requests partnership_requests_university_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnership_requests
    ADD CONSTRAINT partnership_requests_university_id_fkey FOREIGN KEY (university_id) REFERENCES public.universities(id);


--
-- Name: partnership_state partnership_state_partnership_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnership_state
    ADD CONSTRAINT partnership_state_partnership_id_fkey FOREIGN KEY (partnership_id) REFERENCES public.partnerships(id);


--
-- Name: partnerships partnerships_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnerships
    ADD CONSTRAINT partnerships_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: partnerships partnerships_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnerships
    ADD CONSTRAINT partnerships_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.workflow_stages(id);


--
-- Name: partnerships partnerships_university_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.partnerships
    ADD CONSTRAINT partnerships_university_id_fkey FOREIGN KEY (university_id) REFERENCES public.universities(id);


--
-- Name: students students_partnership_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_partnership_id_fkey FOREIGN KEY (partnership_id) REFERENCES public.partnerships(id);


--
-- PostgreSQL database dump complete
--

\unrestrict DWTgJ1qv7XNu9VHQdgffVzwdo9ger5qOy5FYBMvgAtZgNhdzD0X1bRpndjUSJeI

